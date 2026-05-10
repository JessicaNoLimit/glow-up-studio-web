const { pool } = require('../database/connection');

class ServicesService {
  static mapRow(row) {
    return {
      ...row,
      total_duration_minutes: parseInt(row.total_duration_minutes),
    };
  }

  static async getAll(connection = pool) {
    const [rows] = await connection.query(`
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

    return rows.map((row) => this.mapRow(row));
  }

  static async getActive(connection = pool) {
    const [rows] = await connection.query(`
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
      WHERE active = 1
      ORDER BY category, name
    `);

    return rows.map((row) => this.mapRow(row));
  }

  static async getById(id, connection = pool) {
    const [rows] = await connection.query(`
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

    return this.mapRow(rows[0]);
  }

  static async getActiveById(id, connection = pool) {
    const [rows] = await connection.query(`
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
        AND active = 1
    `, [id]);

    if (rows.length === 0) return null;

    return this.mapRow(rows[0]);
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
