const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET /api/universities -> public, returns all universities as [{ id, name, location }]
router.get('/', async (req, res, next) => {
  try {
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        name: true,
        location: true
      },
      orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
