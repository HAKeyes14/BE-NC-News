const express = require('express');
const apiRouter = require('./routes/api-router')
const {errorHandler} = require('./error-handling/error-handlers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use(errorHandler);

module.exports = app;