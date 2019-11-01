const bcrypt = require('bcrypt');

const formatDates = list => {
    const formattedArr = list.map(obj => {
        const formattedObj = {...obj};
        const formattedDate = new Date(obj.created_at);
        formattedObj.created_at = formattedDate;
        return formattedObj;
    });
    return formattedArr;
};

const makeRefObj = list => {
    const refObj = list.reduce((ref, current) => {
        return {
            ...ref,
            [current.title]: current.article_id
        }
    }, {})
    return refObj;
};

const formatComments = (comments, articleRef) => {
    const formattedComments = comments.map(comment => {
        return {
            author: comment.created_by,
            article_id: articleRef[comment.belongs_to],
            body: comment.body,
            created_at: comment.created_at,
            votes: comment.votes
        }
    });
    const dateFormattedComments = formatDates(formattedComments);
    return dateFormattedComments;
};

const formatUsers = (rawUsers) => {
    return rawUsers.map(user => ({
      ...user,
      password: bcrypt.hashSync('password', 10)
    }));
  };

module.exports = {formatDates, makeRefObj, formatComments, formatUsers}