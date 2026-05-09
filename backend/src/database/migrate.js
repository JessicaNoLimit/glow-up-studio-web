const fs = require('fs').promises;
const path = require('path');
const mysqlPromise = require('mysql2/promise');
const { config } = require('../config/env');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

const migrationsPool = mysqlPromise.createPool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 1,
});

async function ensureSchemaMigrationsTable() {
  await migrationsPool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      migration VARCHAR(255) PRIMARY KEY,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✓ schema_migrations table ready');
}

async function getExecutedMigrations() {
  const [rows] = await migrationsPool.query(
    'SELECT migration FROM schema_migrations ORDER BY migration'
  );
  return new Set(rows.map(row => row.migration));
}

async function getMigrationFiles() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort();
}

function extractUpBlock(sql) {
  const normalizedSql = sql.replace(/\r\n/g, '\n');
  const upMatch = normalizedSql.match(/-- UP\s*\n([\s\S]*?)\s*-- DOWN/);

  if (!upMatch) {
    return normalizedSql.trim();
  }

  return upMatch[1].trim();
}

async function executeMigration(migrationFile) {
  const filePath = path.join(MIGRATIONS_DIR, migrationFile);
  const fullSql = await fs.readFile(filePath, 'utf8');

  const upSql = extractUpBlock(fullSql);

  console.log(`\n→ Executing: ${migrationFile}`);

  const connection = await migrationsPool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(upSql);
    await connection.query(
      'INSERT INTO schema_migrations (migration) VALUES (?)',
      [migrationFile]
    );
    await connection.commit();
    console.log(`  ✓ Success`);
    return true;
  } catch (error) {
    await connection.rollback();
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  } finally {
    connection.release();
  }
}

async function migrate() {
  console.log('=== Database Migrations ===\n');

  try {
    await ensureSchemaMigrationsTable();

    const executed = await getExecutedMigrations();
    console.log(`\nAlready executed: ${executed.size} migrations`);

    const files = await getMigrationFiles();
    console.log(`Available migrations: ${files.length}`);

    const pending = files.filter(file => !executed.has(file));

    if (pending.length === 0) {
      console.log('\n✓ No pending migrations to run');
      return;
    }

    console.log(`\nPending migrations: ${pending.length}`);
    console.log('─────────────────────────────────');

    let successCount = 0;
    let failCount = 0;

    for (const file of pending) {
      const success = await executeMigration(file);
      if (success) {
        successCount++;
      } else {
        failCount++;
        break;
      }
    }

    console.log('\n─────────────────────────────────');
    console.log(`Executed: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Remaining: ${pending.length - successCount - failCount}`);

    if (failCount > 0) {
      console.log('\n✗ Migration stopped due to errors');
      process.exit(1);
    } else {
      console.log('\n✓ All migrations completed successfully');
    }

  } catch (error) {
    console.error('\n✗ Fatal error:', error.message);
    process.exit(1);
  } finally {
    await migrationsPool.end();
  }
}

async function status() {
  console.log('=== Migration Status ===\n');

  try {
    await ensureSchemaMigrationsTable();

    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();

    console.log(`Total migrations: ${files.length}`);
    console.log(`Executed: ${executed.size}`);
    console.log(`Pending: ${files.length - executed.size}\n`);

    if (executed.size > 0) {
      console.log('Executed migrations:');
      Array.from(executed).forEach(m => console.log(`  ✓ ${m}`));
    }

    const pending = files.filter(file => !executed.has(file));
    if (pending.length > 0) {
      console.log('\nPending migrations:');
      pending.forEach(m => console.log(`  ○ ${m}`));
    }

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  } finally {
    await migrationsPool.end();
  }
}

const command = process.argv[2] || 'migrate';

if (command === 'migrate') {
  migrate();
} else if (command === 'status') {
  status();
} else {
  console.log('Usage: node migrate.js [migrate|status]');
  process.exit(1);
}
