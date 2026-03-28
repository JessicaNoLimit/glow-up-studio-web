const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');

const { config } = require('./env');
const { sessionStoreConnection } = require('../database/connection');

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    schema: {
      tableName: 'admin_sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires_at',
        data: 'session_data',
      },
    },
  },
  sessionStoreConnection
);

const sessionMiddleware = session({
  name: config.sessionName,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: config.adminSessionMaxAge,
  },
});

module.exports = {
  sessionMiddleware,
  sessionStore,
};
