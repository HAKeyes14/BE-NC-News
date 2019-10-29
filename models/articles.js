const connection = require('../db/connection');

exports.selectArticleById = (article_id) => {
    const article = connection('articles')
    .first('*')
    .where('article_id', article_id);
    
    const count = connection('comments')
    .select('*')
    .where({article_id})
    .then(comments => {
        return comments.length
    });

    return Promise.all([article, count])
    .then(([article, count]) => {
        article.comment_count = count;
        return article;
    });
}