const articlesRouter = require('express').Router();
const {getArticleById, patchArticleVotes, postComment, getComments} = require('../controllers/articles');

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleVotes);
articlesRouter.route('/:article_id/comments').get(getComments).post(postComment);

module.exports = articlesRouter;