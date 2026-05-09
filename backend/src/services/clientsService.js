const { pool } = require('../database/connection');

class ClientsService {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        first_name,
        last_name,
        phone,
        email,
        notes,
        created_at
      FROM clients
      ORDER BY first_name, last_name
    `);

    return rows.map(row => ({
      ...row,
      full_name: `${row.first_name} ${row.last_name || ''}`.trim()
    }));
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT
        id,
        first_name,
        last_name,
        phone,
        email,
        notes,
        created_at
      FROM clients
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      full_name: `${row.first_name} ${row.last_name || ''}`.trim()
    };
  }

  static async create(clientData) {
    const { first_name, last_name, phone, email, notes } = clientData;

    const [result] = await pool.query(`
      INSERT INTO clients (first_name, last_name, phone, email, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [first_name, last_name, phone, email, notes]);

    return this.getById(result.insertId);
  }

  static async update(id, clientData) {
    const { first_name, last_name, phone, email, notes } = clientData;

    await pool.query(`
      UPDATE clients
      SET first_name = ?, last_name = ?, phone = ?, email = ?, notes = ?
      WHERE id = ?
    `, [first_name, last_name, phone, email, notes, id]);

    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
  }

  static async getTotalCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM clients');
    return rows[0].count;
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(`
      SELECT
        id,
        first_name,
        last_name,
        phone,
        email
      FROM clients
      WHERE first_name LIKE ?
        OR last_name LIKE ?
        OR phone LIKE ?
        OR email LIKE ?
      ORDER BY first_name, last_name
      LIMIT 20
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);

    return rows.map(row => ({
      ...row,
      full_name: `${row.first_name} ${row.last_name || ''}`.trim()
    }));
  }
}

module.exports = ClientsService;
