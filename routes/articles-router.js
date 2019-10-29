const articlesRouter = require('express').Router();
const {getArticleById, patchArticleVotes, postComment, getComments, getArticles} = require('../controllers/articles');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleVotes);
articlesRouter.route('/:article_id/comments').get(getComments).post(postComment);

module.exports = articlesRouter;