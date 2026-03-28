const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const { config } = require('../config/env');

const databaseConfig = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
};

const pool = mysqlPromise.createPool({
  ...databaseConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const sessionStoreConnection = mysql.createPool(databaseConfig);

async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  connection.release();
}

module.exports = {
  pool,
  sessionStoreConnection,
  testDatabaseConnection,
};
