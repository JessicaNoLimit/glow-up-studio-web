const { pool } = require('../database/connection');

class AdminUser {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      `
        SELECT id, name, email, password_hash, role, active, created_at
        FROM admin_users
        WHERE email = ? AND active = 1
        LIMIT 1
      `,
      [email]
    );

    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
        SELECT id, name, email, role, active, created_at
        FROM admin_users
        WHERE id = ? AND active = 1
        LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static toSafeProfile(adminUser) {
    if (!adminUser) {
      return null;
    }

    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      active: Boolean(adminUser.active),
      createdAt: adminUser.created_at,
    };
  }
}

module.exports = AdminUser;
