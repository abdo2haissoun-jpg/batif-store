const { Client } = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('/Users/webloo/Desktop/batif dev/batif-app/supabase/schema.sql', 'utf8');

const client = new Client({
  connectionString: 'postgresql://postgres:fIionxM0koTZapZi@db.bsibadesqhzerzuxegwv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(sql);
    console.log('Schema created successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
