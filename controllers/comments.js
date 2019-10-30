const {updateCommentVotes} = require('../models/comments');

exports.patchCommentVotes = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    updateCommentVotes(comment_id, inc_votes)
    .then(comment => {
        res.status(201).send({comment});
    });
}