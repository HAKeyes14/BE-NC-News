const loginRouter = require('express').Router();
const {sendToken} = require('../controllers/login');
const {send405Error} = require('../error-handling/error-handlers');

loginRouter.route('/').post(sendToken).all(send405Error);

module.exports = loginRouter;