const usersRouter = require('express').Router();
const {getUserByUsername} = require('../controllers/users');
const {send405Error} = require('../error-handling/error-handlers');

usersRouter.route('/:username').get(getUserByUsername).all(send405Error);

module.exports = usersRouter;