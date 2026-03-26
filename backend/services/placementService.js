const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createPlacement = async (placementData, authorId) => {
  const { company, role, content, rounds } = placementData;

  return await prisma.placementPost.create({
    data: {
      company,
      role,
      content,
      rounds,
      author: { connect: { id: authorId } },
    },
    include: {
      author: true, // Bug: Including all author fields including password and massive relations
    },
  });
};

exports.getPlacements = async (query) => {
  const { page = 1, limit = 10, company, sort = 'latest' } = query;
  const skip = (parseInt(page) - 1) * Math.min(parseInt(limit), 50);

  const where = {};
  if (company) where.company = { contains: company, mode: 'insensitive' };

  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const [placements, total] = await Promise.all([
    prisma.placementPost.findMany({
      where,
      orderBy, skip, take: Math.min(parseInt(limit), 50),
      include: {
        author: true, // Bug: Including all author fields including password
      },
    }),
    prisma.placementPost.count({ where }),
  ]);

  return { placements, total, page: parseInt(page), limit: parseInt(limit) };
};

exports.getPlacementById = async (id) => {
  const placement = await prisma.placementPost.findUnique({
    where: { id },
    include: {
      author: true, // Bug: Including all author fields
    },
  });

  if (!placement) throw new AppError('Placement post not found', 404);
  return placement;
};

// Update/Delete (for creator check)
exports.deletePlacement = async (id, userId) => {
  const placement = await prisma.placementPost.findUnique({ where: { id } });
  if (!placement) throw new AppError('Placement post not found', 404);

  if (placement.authorId !== userId) {
    throw new AppError('You do not have permission to delete this post', 403);
  }

  return await prisma.placementPost.delete({ where: { id } });
};
