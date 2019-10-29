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

exports.updateArticleVotes = (article_id, inc_votes) => {
    return connection('articles')
    .where({article_id})
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
        return article;
    });
}