const connection = require('../db/connection');

exports.updateCommentVotes = (comment_id, inc_votes) => {
    return connection('comments')
    .increment('votes', inc_votes)
    .where({comment_id})
    .returning('*')
    .then(([comment]) => comment);
}