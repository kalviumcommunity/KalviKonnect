const prisma = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const createToken = (userId, role, email) => {
  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (userData) => {
  const { email, password, role, universityId } = userData;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Auto-ensure university exists (to prevent foreign key errors for new setups)
  try {
    const university = await prisma.university.upsert({
      where: { id: universityId || 'univ-default-123' },
      update: {},
      create: {
        id: universityId || 'univ-default-123',
        name: 'Kalvium University',
        location: 'Remote'
      }
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        university: { connect: { id: university.id } },
      },
      select: {
        id: true,
        email: true,
        role: true,
        universityId: true,
      },
    });

    const token = createToken(user.id, user.role, user.email);
    return { ...user, token };
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('An account with this email already exists', 409);
    }
    throw err;
  }
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update lastActiveAt
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  const token = createToken(user.id, user.role, user.email);
  const userSafe = {
    id: user.id,
    email: user.email,
    role: user.role,
    universityId: user.universityId,
    token,
  };

  return userSafe;
};
