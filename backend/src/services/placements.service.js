const prisma = require('../db');
const AppError = require('../utils/AppError');
const { generateResponse } = require("./aiService");
const { buildPlacementStructurePrompt, parseAIJson } = require("../utils/promptBuilder");

exports.analyzePlacementWithAI = async (placementId) => {
  const placement = await prisma.placementPost.findUnique({
    where: { id: placementId },
    select: { 
      id: true, 
      company: true, 
      role: true, 
      content: true,
      aiRoundBreakdown: true,
      aiPrepTopics: true,
      aiPrepChecklist: true,
      aiAnalyzedAt: true
    },
  });

  if (!placement) throw new AppError("Placement experience not found", 404);

  // Cache Check: 24 hours
  const CACHE_LIMIT = 24 * 60 * 60 * 1000;
  const isCacheValid = placement.aiAnalyzedAt && (Date.now() - new Date(placement.aiAnalyzedAt).getTime() < CACHE_LIMIT);

  if (isCacheValid && placement.aiRoundBreakdown) {
    console.log(`[AI CACHE] Returning cached analysis for placement: ${placementId}`);
    return {
      success: true,
      data: {
        roundBreakdown: placement.aiRoundBreakdown,
        prepTopics: placement.aiPrepTopics,
        prepChecklist: placement.aiPrepChecklist,
        cached: true,
        lastAnalyzed: placement.aiAnalyzedAt
      }
    };
  }

  // No cache -> Run Gemini
  const { systemMsg, userPrompt } = buildPlacementStructurePrompt(placement.content, placement.company, placement.role);
  const aiResult = await generateResponse(userPrompt, systemMsg);

  if (!aiResult.success) return aiResult;

  const parsed = parseAIJson(aiResult.text);
  if (!parsed.success) return parsed;

  const { roundBreakdown, prepTopics, prepChecklist } = parsed.data;

  // Save for caching
  const updated = await prisma.placementPost.update({
    where: { id: placementId },
    data: {
      aiRoundBreakdown: roundBreakdown,
      aiPrepTopics: prepTopics,
      aiPrepChecklist: prepChecklist,
      aiAnalyzedAt: new Date()
    }
  });

  return {
    success: true,
    data: {
      roundBreakdown: updated.aiRoundBreakdown,
      prepTopics: updated.aiPrepTopics,
      prepChecklist: updated.aiPrepChecklist,
      cached: false,
      lastAnalyzed: updated.aiAnalyzedAt
    }
  };
};

exports.createPlacement = async (placementData, authorId) => {
  const { company, role, content, rounds } = placementData;

  const placement = await prisma.placementPost.create({
    data: {
      company,
      role,
      content,
      rounds,
      author: { connect: { id: authorId } },
    },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
  return placement;
};

exports.getPlacements = async (query) => {
  const { page = 1, limit = 10, company, sort = 'latest' } = query || {};
  const parsedPage = Math.max(parseInt(page), 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;

  const where = {};
  if (company) where.company = { contains: company, mode: 'insensitive' };

  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const [placements, total] = await prisma.$transaction([
    prisma.placementPost.findMany({
      where,
      orderBy,
      skip,
      take: parsedLimit,
      select: {
        id: true,
        company: true,
        role: true,
        createdAt: true,
        upvoteCount: true,
        aiAnalyzedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    }),
    prisma.placementPost.count({ where }),
  ]);

  return { 
    placements, 
    total, 
    page: parsedPage, 
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
    hasNextPage: parsedPage < Math.ceil(total / parsedLimit)
  };
};

exports.getPlacementById = async (id) => {
  const placement = await prisma.placementPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, role: true } },
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
