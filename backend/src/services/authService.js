const bcrypt = require('bcrypt');

const AdminUser = require('../models/AdminUser');

function createAuthError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function loginAdmin({ email, password }) {
  if (!email || !password) {
    throw createAuthError('Email and password are required', 400);
  }

  const adminUser = await AdminUser.findByEmail(email);

  if (!adminUser) {
    throw createAuthError('Invalid admin credentials', 401);
  }

  const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);

  if (!passwordMatches) {
    throw createAuthError('Invalid admin credentials', 401);
  }

  return AdminUser.toSafeProfile(adminUser);
}

module.exports = {
  loginAdmin,
};
