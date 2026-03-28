const asyncHandler = require('../utils/asyncHandler');
const { config } = require('../config/env');
const { loginAdmin } = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await loginAdmin({ email, password });

  req.session.adminUser = {
    id: adminUser.id,
    role: adminUser.role,
  };

  res.status(200).json({
    message: 'Login successful',
    adminUser,
  });
});

const logout = asyncHandler(async (req, res, next) => {
  if (!req.session) {
    return res.status(204).send();
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie(config.sessionName);
    return res.status(204).send();
  });
});

const getLoginStatus = asyncHandler(async (req, res) => {
  res.status(200).json({
    authenticated: Boolean(req.session?.adminUser),
    loginRoute: '/admin/login',
  });
});

module.exports = {
  login,
  logout,
  getLoginStatus,
};
