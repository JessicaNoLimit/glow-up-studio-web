const fs = require('fs').promises;
const path = require('path');
const mysqlPromise = require('mysql2/promise');
const { config } = require('../config/env');

const SEEDS_DIR = path.join(__dirname, 'seeds');

const seedsPool = mysqlPromise.createPool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 1,
});

async function getSeedFiles() {
  const files = await fs.readdir(SEEDS_DIR);
  return files.sort();
}

async function executeSeed(seedFile) {
  const filePath = path.join(SEEDS_DIR, seedFile);
  const ext = path.extname(seedFile);

  console.log(`\n→ Seeding: ${seedFile}`);

  const connection = await seedsPool.getConnection();

  try {
    await connection.beginTransaction();

    if (ext === '.js') {
      delete require.cache[require.resolve(filePath)];
      const seedModule = require(filePath);
      await seedModule.seed({ connection });
    } else {
      const sql = await fs.readFile(filePath, 'utf8');
      await connection.query(sql);
    }

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

async function seed() {
  console.log('=== Database Seeds ===\n');

  try {
    const files = await getSeedFiles();
    console.log(`Available seeds: ${files.length}`);
    console.log('─────────────────────────────────');

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const success = await executeSeed(file);
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

    if (failCount > 0) {
      console.log('\n✗ Seeding stopped due to errors');
      process.exit(1);
    } else {
      console.log('\n✓ All seeds completed successfully');
    }

  } catch (error) {
    console.error('\n✗ Fatal error:', error.message);
    process.exit(1);
  } finally {
    await seedsPool.end();
  }
}

seed();
