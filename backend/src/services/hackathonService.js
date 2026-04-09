const prisma = require('../db');
const AppError = require('../utils/AppError');

console.log(">>> Hackathon Service Loaded (Stability V4) <<<");

exports.createHackathon = async (data, userId, role) => {
  return await prisma.$withRetry(async () => {
    // Allow both Students and Managers to create opportunities
    const { title, description, deadline } = data;
    
    if (!title || !description || !deadline) {
      throw new AppError('Title, description, and deadline are required fields.', 400);
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw new AppError('Invalid deadline date format.', 400);
    }

    if (deadlineDate <= new Date()) {
      throw new AppError('Deadline must be in the future.', 400);
    }

    console.log(`Creating hackathon for User ${userId} with role ${role}`);

    return await prisma.hackathon.create({
      data: {
        title,
        description,
        deadline: deadlineDate,
        author: { connect: { id: userId } }
      }
    });
  });
};

exports.getHackathons = async (requestedStatus) => {
  return await prisma.$withRetry(async () => {
    // Default: Get all open/active hackathons if no status specified
    const where = requestedStatus ? { status: requestedStatus } : { 
      OR: [
        { status: 'OPEN' },
        { status: 'active' },
        { status: 'ACTIVE' }
      ]
    };
    
    return await prisma.hackathon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } }
      }
    });
  });
};

exports.applyToHackathon = async (hackathonId, userId, role, data) => {
  return await prisma.$withRetry(async () => {
    if (role !== 'STUDENT') {
      throw new AppError('Only students can apply to opportunities', 403);
    }

    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon) throw new AppError('Opportunity not found', 404);
    
    const currentStatus = hackathon.status.toLowerCase();
    if (currentStatus !== 'open' && currentStatus !== 'active') {
      throw new AppError('Application period has closed', 400);
    }
    
    if (new Date(hackathon.deadline) < new Date()) throw new AppError('Deadline has passed', 400);

    try {
      return await prisma.hackathonApplication.create({
        data: {
          portfolioLink: data.portfolioLink,
          hackathon: { connect: { id: hackathonId } },
          user: { connect: { id: userId } }
        }
      });
    } catch (err) {
      if (err.code === 'P2002') throw new AppError('You have already applied to this opportunity', 409);
      throw err;
    }
  });
};

exports.getApplicants = async (hackathonId, userId, role) => {
  return await prisma.$withRetry(async () => {
    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon) throw new AppError('Opportunity not found', 404);

    // Authorization: Only the creator (manager) can see applicants
    if (hackathon.authorId !== userId && role !== 'CAMPUS_MANAGER') {
      throw new AppError('Unauthorized access to applicant data', 403);
    }

    return await prisma.hackathonApplication.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
  });
};

exports.hireApplicant = async (applicationId, userId, role) => {
  return await prisma.$withRetry(async () => {
    const application = await prisma.hackathonApplication.findUnique({
      where: { id: applicationId },
      include: { hackathon: true }
    });

    if (!application) throw new AppError('Application not found', 404);

    // Authorization
    if (application.hackathon.authorId !== userId && role !== 'CAMPUS_MANAGER') {
      throw new AppError('Unauthorized to select candidate', 403);
    }

    return await prisma.hackathonApplication.update({
      where: { id: applicationId },
      data: { status: 'SELECTED' }
    });
  });
};
