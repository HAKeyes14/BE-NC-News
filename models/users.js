const connection = require('../db/connection');

exports.selectUserByUsername = (username) => {
    if (username.length > 20) {
        return Promise.reject({
            status: 400,
            message: `Username: ${username} is not a valid username.`,
        });
    }
    return connection('users')
    .first('*')
    .where('username', username)
    .then(user => {
        if (!user) {
            return Promise.reject({
                status: 404,
                message: `User with username: ${username} does not exist.`,
            });
        }
        return user;
    });
}