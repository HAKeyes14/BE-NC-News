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
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
        res.status(201).send({article});
    });
}