const bcrypt = require('bcrypt');

async function seed({ connection }) {
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  await connection.query(`
    INSERT IGNORE INTO admin_users (name, email, password_hash, role, active)
    VALUES (?, ?, ?, ?, ?)
  `, ['Admin Glow Up', 'admin@glowup.com', hash, 'admin', true]);

  console.log('  Email: admin@glowup.com');
  console.log('  Password:', password);
}

module.exports = { seed };
