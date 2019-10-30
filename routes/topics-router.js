const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topics');
const {send405Error} = require('../error-handling/error-handlers');

topicsRouter.route('/').get(getTopics).all(send405Error);

module.exports = topicsRouter;