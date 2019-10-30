const connection = require('../db/connection');

exports.updateCommentVotes = (comment_id, body) => {
    if(!body.inc_votes) {
        return Promise.reject({
            status: 400,
            message: '"inc_votes" must be included on the body in order to update "votes"'
        });
    }
    if(Object.keys(body).length !== 1) {
        return Promise.reject({
            status: 400,
            message: '"inc_votes" must be the only item on the body in order to update "votes"'
        });
    }
    const inc_votes = body.inc_votes;
    return connection('comments')
    .increment('votes', inc_votes)
    .where({comment_id})
    .returning('*')
    .then(([comment]) => {
        if(!comment) {
            return Promise.reject({
                status: 404,
                message: `Comment with comment_id: ${comment_id} does not exist.`
            });
        }
        return comment;
    });
}

exports.removeComment = (comment_id) => {
    return connection('comments')
    .first('*')
    .where({comment_id})
    .then(comment => {
        if(!comment) {
            return Promise.reject({
                status: 404, 
                message: `Comment with comment_id: ${comment_id} does not exist.`
            });
        }
    })
    .then(() => {
        return connection('comments')
        .where({comment_id})
        .del();
    }); 
}