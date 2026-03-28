const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: 'Admin dashboard access granted',
    adminUser: req.adminUser,
  });
});

module.exports = {
  getDashboard,
};
