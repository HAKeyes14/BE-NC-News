const {selectUserByUsername} = require('../models/login');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || require('../config').JWT_SECRET;
const bcrypt = require('bcrypt');

exports.sendToken = (req, res, next) => {
    const {username, password} = req.body;
    selectUserByUsername(username)
    .then(user => {
        if (user) return Promise.all([bcrypt.compare(password, user.password), user]);
        else next({ status: 401, message: 'Invalid username or password.' });
    })
    .then(([passwordOk, user]) => {
        if (user && passwordOk) {
            // const token = jwt.sign(
            //     { user: user.username, iat: Date.now() },
            //     JWT_SECRET
            // );
            res.send({ token: 'test' });
        } else {
            next({ status: 401, message: 'Invalid username or password.' });
        }
    })
    .catch(next);
}

exports.authorise = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    if (token !== "test") {
        next({ status: 401, message: 'Unauthorised' });
    } else next();
    // jwt.verify(token, JWT_SECRET, (err, res) => {
    //     if (err) next({ status: 401, message: 'Unauthorised' });
    //     else next();
    // })
};