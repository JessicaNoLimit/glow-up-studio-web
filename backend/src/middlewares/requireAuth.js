const AdminUser = require('../models/AdminUser');

async function requireAuth(req, res, next) {
  try {
    const sessionAdmin = req.session?.adminUser;

    if (!sessionAdmin?.id) {
      // Para peticiones API, devolver 401 JSON en lugar de redirect
      if (req.path.startsWith('/admin/') && req.xhr) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect('/admin/login');
    }

    const adminUser = await AdminUser.findById(sessionAdmin.id);

    if (!adminUser) {
      req.session.destroy(() => {});
      // Para peticiones API, devolver 401 JSON en lugar de redirect
      if (req.path.startsWith('/admin/') && req.xhr) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect('/admin/login');
    }

    req.adminUser = AdminUser.toSafeProfile(adminUser);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAuth;
