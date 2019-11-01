const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const loginRouter = require('./login-router');
const {getEndpoints} = require('../controllers/api');
const {send405Error} = require('../error-handling/error-handlers');

apiRouter.use('/login', loginRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.route('/').get(getEndpoints).all(send405Error);

module.exports = apiRouter;