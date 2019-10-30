const commentsRouter = require('express').Router();
const {patchCommentVotes, deleteComment} = require('../controllers/comments');
const {send405Error} = require('../error-handling/error-handlers');

commentsRouter.route('/:comment_id').patch(patchCommentVotes).delete(deleteComment).all(send405Error);

module.exports = commentsRouter;