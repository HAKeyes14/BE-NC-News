const connection = require('../db/connection');

exports.selectArticleById = (article_id) => {
    const article = connection('articles')
    .first('*')
    .where({article_id});
    
    const count = connection('comments')
    .select('*')
    .where({article_id})
    .then(comments => {
        return comments.length
    });

    return Promise.all([article, count])
    .then(([article, count]) => {
        if(!article) {
            return Promise.reject({
                status: 404,
                message: `Article with article_id: ${article_id} does not exist.`
            })
        }
        return [article, count];
    })
    .then(([article, count]) => {
        article.comment_count = count;
        return article;
    });
}

exports.updateArticleVotes = (article_id, body) => {
    if(!body.inc_votes) {
        return Promise.reject({
            status: 400,
            message: '"inc_votes" must be included on the body in order to update "votes"'
        });
    }
    if(Object.keys(body).length !== 1) {
        return Promise.reject({
            status: 400,
            message: '"inc_votes" must be the only item on the body in order to update "votes"'
        });
    }
    const inc_votes = body.inc_votes;
    return connection('articles')
    .where({article_id})
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => article);
}

exports.addComment = (article_id, {username, body}) => {
    const newComment = {
        author: username,
        body,
        article_id
    }
    return connection('comments')
    .insert(newComment)
    .returning('*')
    .then(([comment]) => comment)
}