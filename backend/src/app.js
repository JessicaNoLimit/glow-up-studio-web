const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { config } = require('./config/env');
const { sessionMiddleware } = require('./config/session');
const router = require('./routes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(
  cors({
    origin: config.appOrigin,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
