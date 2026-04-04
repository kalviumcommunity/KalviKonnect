// backend/src/config/env.js
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "PORT",
  "NODE_ENV",
  "CORS_ORIGIN",
  "GEMINI_API_KEY",
];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `[KalviKonnect] ❌ Missing required environment variables:\n  ${missing.join("\n  ")}`
    );
    console.error(
      `[KalviKonnect] Copy .env.example to .env and fill in all values.`
    );
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return;
  }
  console.log("[KalviKonnect] ✅ All required environment variables present.");
}

module.exports = { validateEnv };
