const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createHackathon = async (data, userId, role) => {
  // Only Campus Manager or higher can post hackathons/jobs
  if (role !== 'CAMPUS_MANAGER') {
    throw new AppError('Only Campus Managers can create opportunities', 403);
  }

  const { title, description, deadline } = data;
  if (new Date(deadline) <= new Date()) {
    throw new AppError('Deadline must be in the future', 400);
  }

  return await prisma.hackathon.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      author: { connect: { id: userId } }
    }
  });
};

exports.getHackathons = async (status = 'OPEN') => {
  return await prisma.hackathon.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } }
    }
  });
};

exports.applyToHackathon = async (hackathonId, userId, role) => {
  if (role !== 'STUDENT') {
    throw new AppError('Only students can apply to opportunities', 403);
  }

  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) throw new AppError('Opportunity not found', 404);
  if (hackathon.status !== 'OPEN') throw new AppError('Application period has closed', 400);
  if (new Date(hackathon.deadline) < new Date()) throw new AppError('Deadline has passed', 400);

  try {
    return await prisma.hackathonApplication.create({
      data: {
        hackathon: { connect: { id: hackathonId } },
        user: { connect: { id: userId } }
      }
    });
  } catch (err) {
    if (err.code === 'P2002') throw new AppError('You have already applied to this opportunity', 409);
    throw err;
  }
};

exports.getApplicants = async (hackathonId, userId, role) => {
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
};

exports.hireApplicant = async (applicationId, userId, role) => {
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
};
