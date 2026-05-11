const { pool } = require('../database/connection');

class AppointmentsService {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.client_id,
        a.start_at,
        a.end_at,
        a.total_duration_minutes,
        a.status,
        a.origin,
        a.notes,
        c.first_name,
        c.last_name,
        c.phone,
        c.email
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      ORDER BY a.start_at DESC
    `);

    return rows.map(row => ({
      ...row,
      client: {
        id: row.client_id,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
        email: row.email,
        full_name: `${row.first_name} ${row.last_name || ''}`.trim()
      }
    }));
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.client_id,
        a.start_at,
        a.end_at,
        a.total_duration_minutes,
        a.status,
        a.origin,
        a.notes,
        c.first_name,
        c.last_name,
        c.phone,
        c.email
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE a.id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      client: {
        id: row.client_id,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
        email: row.email,
        full_name: `${row.first_name} ${row.last_name || ''}`.trim()
      }
    };
  }

  static async getTodayAppointments() {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.client_id,
        a.start_at,
        a.end_at,
        a.total_duration_minutes,
        a.status,
        a.origin,
        c.first_name,
        c.last_name,
        c.phone
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE DATE(a.start_at) = CURDATE()
      ORDER BY a.start_at ASC
    `);

    return rows.map(row => ({
      ...row,
      client: {
        id: row.client_id,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
        full_name: `${row.first_name} ${row.last_name || ''}`.trim()
      }
    }));
  }

  static async getUpcomingAppointments(limit = 5) {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.client_id,
        a.start_at,
        a.end_at,
        a.total_duration_minutes,
        a.status,
        c.first_name,
        c.last_name,
        c.phone
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE a.start_at >= NOW()
        AND a.status IN ('pending_payment', 'confirmed')
      ORDER BY a.start_at ASC
      LIMIT ?
    `, [limit]);

    return rows.map(row => ({
      ...row,
      client: {
        id: row.client_id,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
        full_name: `${row.first_name} ${row.last_name || ''}`.trim()
      }
    }));
  }

  static async create(appointmentData) {
    const {
      client_id,
      start_at,
      end_at,
      total_duration_minutes,
      status = 'pending_payment',
      origin = 'admin',
      notes
    } = appointmentData;

    const [result] = await pool.query(`
      INSERT INTO appointments (client_id, start_at, end_at, total_duration_minutes, status, origin, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [client_id, start_at, end_at, total_duration_minutes, status, origin, notes]);

    return this.getById(result.insertId);
  }

  static async update(id, appointmentData) {
    const {
      client_id,
      start_at,
      end_at,
      total_duration_minutes,
      status,
      origin,
      notes
    } = appointmentData;

    await pool.query(`
      UPDATE appointments
      SET client_id = ?, start_at = ?, end_at = ?, total_duration_minutes = ?,
          status = ?, origin = ?, notes = ?
      WHERE id = ?
    `, [client_id, start_at, end_at, total_duration_minutes, status, origin, notes, id]);

    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
  }

  static async getBlockCountByAppointmentId(appointmentId) {
    const [rows] = await pool.query(`
      SELECT COUNT(*) as count
      FROM appointment_blocks
      WHERE appointment_id = ?
    `, [appointmentId]);

    return rows[0].count;
  }

  static async getTodayCount() {
    const [rows] = await pool.query(`
      SELECT COUNT(*) as count
      FROM appointments
      WHERE DATE(start_at) = CURDATE()
    `);
    return rows[0].count;
  }

  static async getTotalCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM appointments');
    return rows[0].count;
  }
}

module.exports = AppointmentsService;
