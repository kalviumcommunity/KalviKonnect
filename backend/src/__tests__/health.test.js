// backend/src/__tests__/health.test.js
const request = require("supertest");

// Minimal app import for testing — does not call validateEnv
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test_secret_for_ci";
process.env.PORT = "3001";
process.env.NODE_ENV = "test";
process.env.CORS_ORIGIN = "http://localhost:5173";

const app = require("../app");

describe("Health Check", () => {
  it("GET /health returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
