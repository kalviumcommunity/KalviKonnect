const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/users/me -> auth, return full profile
router.get('/me', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        university: { select: { id: true, name: true, location: true } }
      }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { password, ...userWithoutPassword } = user;
    
    // Compute stats
    const stats = await prisma.$transaction([
      prisma.note.count({ where: { authorId: user.id } }),
      prisma.placementPost.count({ where: { authorId: user.id } }),
      prisma.upvote.count({ where: { 
        OR: [
          { note: { authorId: user.id } },
          { placementPost: { authorId: user.id } },
          { reply: { authorId: user.id } },
        ]
      }})
    ]);

    res.status(200).json({ 
      success: true, 
      data: {
        ...userWithoutPassword,
        stats: {
          notesCount: stats[0],
          placementsCount: stats[1],
          totalUpvotes: stats[2]
        }
      } 
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/me -> auth, update name + batchYear + universityId (for onboarding)
router.patch('/me', async (req, res, next) => {
  try {
    const { name, batchYear, universityId } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (batchYear) updateData.batchYear = parseInt(batchYear);
    if (universityId) updateData.universityId = universityId;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: {
        university: { select: { id: true, name: true } }
      }
    });

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me/notes -> auth, user's own notes paginated
router.get('/me/notes', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: { authorId: req.user.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          university: { select: { name: true } }
        }
      }),
      prisma.note.count({ where: { authorId: req.user.id } })
    ]);

    res.status(200).json({
      success: true,
      data: notes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me/placements -> auth, user's own placements paginated
router.get('/me/placements', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [placements, total] = await Promise.all([
      prisma.placementPost.findMany({
        where: { authorId: req.user.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.placementPost.count({ where: { authorId: req.user.id } })
    ]);

    res.status(200).json({
      success: true,
      data: placements,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
