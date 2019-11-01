const connection = require('../db/connection');
console.log(connection._context.client.config.JWT_SECRET)
exports.selectUserByUsername = (username) => {
    return connection('users')
    .first('*')
    .where({username})
}