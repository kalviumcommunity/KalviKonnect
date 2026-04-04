// backend/src/routes/health.route.js
const express = require("express");
const router = express.Router();

const prisma = require("../db");

router.get("/health", async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await prisma.$queryRaw`SELECT 1`;
    }
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || "development",
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      message: "Database unreachable",
    });
  }
});

module.exports = router;
