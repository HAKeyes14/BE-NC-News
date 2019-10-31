const connection = require('../db/connection');

exports.selectArticleById = (article_id) => {
    return connection('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count({comment_count: 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.*')
    .where('articles.article_id', article_id)
    .first()
    .then((article) => {
        if(!article) {
            return Promise.reject({
                status: 404,
                message: `Article with article_id: ${article_id} does not exist.`
            });
        }
        return article;
    });
}

exports.updateArticleVotes = (article_id, body) => {
    let inc_votes = body.inc_votes;
    if(!body.inc_votes) {
        inc_votes = 0;
    }
    if(Object.keys(body).length !== 1) {
        return Promise.reject({
            status: 400,
            message: '"inc_votes" must be the only item on the body in order to update "votes"'
        });
    }
    return connection('articles')
    .where({article_id})
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
        if(!article) {
            return Promise.reject({
                status: 404,
                message: `Article with article_id: ${article_id} does not exist.`
            });
        }
        return article;
    });
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
    .then(([comment]) => {
        return comment
    });
}

exports.selectComments = (article_id, sort_by, order) => {
    if (order !== undefined && order !== 'asc' && order !== 'desc') {
        return Promise.reject({
            status: 400,
            message: `Order: "${order}" is not allowed.`
        });
    }
    return connection('comments')
    .select('*')
    .where({article_id})
    .orderBy(sort_by || 'created_at', order || 'desc')
    .then(comments => {
        if (!comments.length) {
            return connection('articles')
            .select('*')
            .where({article_id})
            .then(([article]) => {
                if(!article) {
                    return Promise.reject({
                        status: 404,
                        message: `Article with article_id: ${article_id} does not exist.`
                    });
                } else return [];
            });
        } else return comments;
    });
}

exports.selectArticles = (sort_by, order, limit, p, {author, topic}) => {
    if(!limit) limit = 10;
    if(!p) p = 1;
    if (order !== undefined && order !== 'asc' && order !== 'desc') {
        return Promise.reject({
            status: 400,
            message: `Order: "${order}" is not allowed.`
        });
    }
    const total_count = connection('articles')
    .select('*')
    .modify((query) => {
        if(author) query.where({'articles.author': author});
        if(topic) query.where({'articles.topic': topic});
    })
    .then((total) => total.length);

    const articles = connection('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count({comment_count: 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.article_id', 'articles.author', 'articles.created_at', 'articles.title', 'articles.topic', 'articles.votes')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify((query) => {
        if(author) query.where({'articles.author': author});
        if(topic) query.where({'articles.topic': topic});
    })
    .limit(limit)
    .offset(limit*(p-1))
    .then(articles => {
        if (!articles.length) {
            if (author) {
                return connection('users')
                .select('*')
                .where({username: author})
                .then(([user]) => {
                    if(!user) {
                        return Promise.reject({
                            status: 404,
                            message: `Author: ${author} does not exist.`
                        });
                    } 
                });
            }
            if (topic) {
                return connection('topics')
                .select('*')
                .where({slug: topic})
                .then(([topics]) => {
                    if(!topics) {
                        return Promise.reject({
                            status: 404,
                            message: `Topic: ${topic} does not exist.`
                        });
                    }
                });
            }
        }
        return articles;
    });
    return Promise.all([articles, total_count])
    .then(([articles, total_count])=> {
        return {articles, total_count};
    });
}

exports.removeArticle = (article_id) => {
    return connection('articles')
    .first('*')
    .where({article_id})
    .then(article => {
        if(!article) {
            return Promise.reject({
                status: 404, 
                message: `Article with article_id: ${article_id} does not exist.`
            });
        }
    })
    .then(() => {
        return connection('articles')
        .where({article_id})
        .del();
    }); 
}