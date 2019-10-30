const express = require('express');
const apiRouter = require('./routes/api-router')
const {customErrorHandler, psqlErrorHandler, serverErrorHandler, routeNotFoundErrorHandler} = require('./error-handling/error-handlers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', routeNotFoundErrorHandler);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(serverErrorHandler);

module.exports = app;