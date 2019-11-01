const {selectUserByUsername} = require('../models/login');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

exports.sendToken = (req, res, next) => {
    const {username, password} = req.body;
    selectUserByUsername(username)
    .then(user => {
        if(!user || password !== user.password) {
            next({ status: 401, message: 'Invalid username or password.' });
        } else {
            const token = jwt.sign(
                { user: user.username, iat: Date.now() },
                JWT_SECRET
            );
            res.send({ token });
        }
    })
    .catch(next);
}

exports.authorise = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) next({ status: 401, message: 'Unauthorised' });
        else next();
    });
};