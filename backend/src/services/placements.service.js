const prisma = require('../db');
const AppError = require('../utils/AppError');
const { generateResponse } = require("./aiService");
const { buildPlacementStructurePrompt, parseAIJson } = require("../utils/promptBuilder");
const { prepareMultimodalData } = require("../utils/aiUtils");

exports.analyzePlacementWithAI = async (placementId) => {
  return await prisma.$withRetry(async () => {
    const placement = await prisma.placementPost.findUnique({
      where: { id: placementId },
      select: { 
        id: true, 
        company: true, 
        role: true, 
        content: true,
        fileUrls: true,
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
      return {
        success: true,
        data: {
          roundBreakdown: placement.aiRoundBreakdown,
          prepTopics: placement.aiPrepTopics,
          prepChecklist: placement.aiPrepChecklist,
          cached: true
        }
      };
    }

    // Process first file if present
    const { fileParts, extractedText } = await prepareMultimodalData(placement.fileUrls[0]);
    
    // Combine raw content with extracted text
    const fullContent = extractedText 
      ? `${placement.content}\n\n[FILE ATTACHMENT TEXT]:\n${extractedText}` 
      : placement.content;

    const { systemMsg, userPrompt } = buildPlacementStructurePrompt(
      fullContent,
      placement.company,
      placement.role
    );

    const aiResult = await generateResponse(userPrompt, systemMsg, fileParts);

    if (!aiResult.success) return aiResult;

    const parsed = parseAIJson(aiResult.text);
    if (!parsed.success) return parsed;

    const { roundBreakdown, prepTopics, prepChecklist } = parsed.data;

    await prisma.placementPost.update({
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
      data: { roundBreakdown, prepTopics, prepChecklist, cached: false }
    };
  });
};

exports.createPlacement = async (data, authorId) => {
  return await prisma.$withRetry(async () => {
    const { company, role, content, rounds, fileUrls } = data;
    return await prisma.placementPost.create({
      data: {
        company,
        role,
        content,
        rounds: rounds || [],
        fileUrls: fileUrls || [],
        author: { connect: { id: authorId } }
      }
    });
  });
};

exports.getPlacements = async (query) => {
  return await prisma.$withRetry(async () => {
    const { page = 1, limit = 10, company } = query;
    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }

    const [placements, total] = await prisma.$transaction([
      prisma.placementPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parsedLimit,
        select: {
          id: true,
          company: true,
          role: true,
          content: true,
          fileUrls: true,
          upvoteCount: true,
          createdAt: true,
          author: { select: { id: true, name: true } }
        }
      }),
      prisma.placementPost.count({ where })
    ]);

    return { 
      placements, 
      total, 
      page: parsedPage, 
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      hasNextPage: parsedPage < Math.ceil(total / parsedLimit)
    };
  });
};

exports.getPlacementById = async (id) => {
  return await prisma.$withRetry(async () => {
    const placement = await prisma.placementPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true } }
      }
    });

    if (!placement) throw new AppError('Placement post not found', 404);
    return placement;
  });
};

exports.deletePlacement = async (id, userId) => {
  return await prisma.$withRetry(async () => {
    const placement = await prisma.placementPost.findUnique({ where: { id } });
    if (!placement) throw new AppError('Placement post not found', 404);
    if (placement.authorId !== userId) throw new AppError('You do not have permission to delete this post', 403);

    return await prisma.placementPost.delete({ where: { id } });
  });
};
