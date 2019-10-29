const {selectArticleById, updateArticleVotes, addComment, selectComments} = require('../models/articles');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params; 
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.patchArticleVotes = (req, res, next) => {
    const body = req.body;
    const {article_id} = req.params;
    updateArticleVotes(article_id, body)
    .then((article) => {
        res.status(201).send({article});
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const body = req.body;
    addComment(article_id, body)
    .then(comment => {
        res.status(201).send({comment});
    })
    .catch(next);
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params;
    const {sort_by, order} = req.query;
    selectComments(article_id, sort_by, order)
    .then((comments) => {
        res.status(200).send({comments});
    })
    .catch(next);
}