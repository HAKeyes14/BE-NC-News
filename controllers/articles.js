const {selectArticleById, updateArticleVotes} = require('../models/articles');

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