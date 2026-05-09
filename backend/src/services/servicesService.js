const { pool } = require('../database/connection');

class ServicesService {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        category,
        price,
        duration_minutes,
        margin_minutes,
        (duration_minutes + COALESCE(margin_minutes, 5)) as total_duration_minutes,
        active
      FROM services
      ORDER BY category, name
    `);

    return rows.map(row => ({
      ...row,
      total_duration_minutes: parseInt(row.total_duration_minutes)
    }));
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        category,
        price,
        duration_minutes,
        margin_minutes,
        (duration_minutes + COALESCE(margin_minutes, 5)) as total_duration_minutes,
        active
      FROM services
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      total_duration_minutes: parseInt(row.total_duration_minutes)
    };
  }

  static async create(serviceData) {
    const { name, category, price, duration_minutes, margin_minutes = 5, active = true } = serviceData;

    const [result] = await pool.query(`
      INSERT INTO services (name, category, price, duration_minutes, margin_minutes, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, category, price, duration_minutes, margin_minutes, active]);

    return this.getById(result.insertId);
  }

  static async update(id, serviceData) {
    const { name, category, price, duration_minutes, margin_minutes, active } = serviceData;

    await pool.query(`
      UPDATE services
      SET name = ?, category = ?, price = ?, duration_minutes = ?, margin_minutes = ?, active = ?
      WHERE id = ?
    `, [name, category, price, duration_minutes, margin_minutes, active, id]);

    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
  }

  static async getCategories() {
    const [rows] = await pool.query(`
      SELECT DISTINCT category
      FROM services
      WHERE active = 1
      ORDER BY category
    `);

    return rows.map(row => row.category);
  }
}

module.exports = ServicesService;
