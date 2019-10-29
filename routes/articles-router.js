const articlesRouter = require('express').Router();
const {getArticleById, patchArticleVotes} = require('../controllers/articles');

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleVotes);

module.exports = articlesRouter;