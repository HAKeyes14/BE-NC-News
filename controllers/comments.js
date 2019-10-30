const {updateCommentVotes, removeComment} = require('../models/comments');

exports.patchCommentVotes = (req, res, next) => {
    const {comment_id} = req.params;
    const body = req.body;
    updateCommentVotes(comment_id, body)
    .then(comment => {
        res.status(201).send({comment});
    })
    .catch(next);
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    removeComment(comment_id)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(next);
}