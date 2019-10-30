const articlesRouter = require('express').Router();
const {getArticleById, patchArticleVotes, postComment, getComments, getArticles} = require('../controllers/articles');
const {send405Error} = require('../error-handling/error-handlers');

articlesRouter.route('/').get(getArticles).all(send405Error);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleVotes).all(send405Error);
articlesRouter.route('/:article_id/comments').get(getComments).post(postComment).all(send405Error);

module.exports = articlesRouter;