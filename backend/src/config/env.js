const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

function getRequiredEnv(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === '') {
    if (name === 'SESSION_SECRET') {
      throw new Error(
        'FATAL: SESSION_SECRET es obligatorio. ' +
          'Añádelo a tu archivo .env (ej: SESSION_SECRET=tu-secreto-super-seguro-unico). ' +
          'El servidor no arrancará sin esta variable por seguridad.'
      );
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:5173',
  sessionSecret: getRequiredEnv('SESSION_SECRET'),
  sessionName: process.env.SESSION_NAME || 'glowup.sid',
  adminSessionMaxAge: Number(process.env.ADMIN_SESSION_MAX_AGE || 1000 * 60 * 60 * 24),
  database: {
    host: getRequiredEnv('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT || 3306),
    name: getRequiredEnv('DB_NAME', 'glow_up_studio'),
    user: getRequiredEnv('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
  },
};

module.exports = {
  config,
};
