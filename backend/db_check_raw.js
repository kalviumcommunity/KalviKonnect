const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

neonConfig.webSocketConstructor = ws;

async function check() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing raw Neon connection (Port 443)...');
  
  const pool = new Pool({ connectionString });
  
  try {
    const result = await pool.query('SELECT 1 as connected');
    console.log('✅ Connection via WebSocket successful:', result.rows);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

check();
