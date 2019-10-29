const express = require('express');
const apiRouter = require('./routes/api-router')
const {customErrorHandler} = require('./error-handling/error-handlers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use(customErrorHandler);

module.exports = app;