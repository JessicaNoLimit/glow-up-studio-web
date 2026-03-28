const app = require('./app');
const { config } = require('./config/env');
const { testDatabaseConnection } = require('./database/connection');

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(config.port, () => {
      console.log(`Glow Up Studio backend listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
