const AdminUser = require('../models/AdminUser');

async function requireAuth(req, res, next) {
  try {
    const sessionAdmin = req.session?.adminUser;

    if (!sessionAdmin?.id) {
      return res.redirect('/admin/login');
    }

    const adminUser = await AdminUser.findById(sessionAdmin.id);

    if (!adminUser) {
      req.session.destroy(() => {});
      return res.redirect('/admin/login');
    }

    req.adminUser = AdminUser.toSafeProfile(adminUser);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAuth;
