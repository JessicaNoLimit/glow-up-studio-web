const AdminUser = require('../models/AdminUser');

async function requireAuth(req, res, next) {
  try {
    const sessionAdmin = req.session?.adminUser;
    const wantsJson = req.headers['accept']?.includes('application/json');

    if (!sessionAdmin?.id) {
      if (wantsJson) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect('/crm/login.html');
    }

    const adminUser = await AdminUser.findById(sessionAdmin.id);

    if (!adminUser) {
      req.session.destroy(() => {});

      if (wantsJson) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect('/crm/login.html');
    }

    req.adminUser = AdminUser.toSafeProfile(adminUser);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAuth;
