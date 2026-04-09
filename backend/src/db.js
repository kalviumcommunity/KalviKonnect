const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure Neon to use WebSockets for port 443 connectivity
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

const prisma = new PrismaClient({ adapter });

/**
 * Executes a database operation with automatic retry for Neon serverless cold-starts.
 * Neon free tier databases sleep after inactivity and may take a moment to wake.
 * @param {Function} fn - Async function to execute
 * @param {number} retries - Max attempts
 */
const withRetry = async (fn, retries = 3, delayMs = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isConnectionError =
        err.message?.includes("Can't reach database") ||
        err.message?.includes('Connection refused') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('Connection pool timeout') ||
        err.code === 'P1001' || // Unreachable
        err.code === 'P1002' || // Timeout
        err.code === 'P1017';  // Server closed connection

      if (isConnectionError && attempt < retries) {
        console.warn(`[DB] Connection failed (attempt ${attempt}/${retries}). Neon may be waking up. Retrying in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs));
        // Reconnect Prisma
        try { await prisma.$disconnect(); } catch (_) {}
        try { await prisma.$connect(); } catch (_) {}
        delayMs = delayMs * 1.5; // Exponential backoff
        continue;
      }
      throw err;
    }
  }
};

// Attach helper to prisma instance for convenience
prisma.$withRetry = withRetry;

module.exports = prisma;
