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
  const { name, email, password, role, universityId } = userData;

  // Check if email exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Auto-ensure university exists (to prevent foreign key errors for new setups)
  try {
    const university = await prisma.user.count() === 0 ? // just to avoid issues, we update default if missing
      await prisma.university.upsert({
        where: { id: universityId || 'univ-default-123' },
        update: {},
        create: {
          id: universityId || 'univ-default-123',
          name: 'Kalvium University',
          location: 'Remote'
        }
      }) : await prisma.university.findUnique({ where: { id: universityId } });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        university: { connect: { id: university?.id || universityId } },
      },
    });

    const token = createToken(user.id, user.role, user.email);
    return { ...user, token };
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('Email already registered', 409);
    }
    throw err;
  }
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update lastActiveAt
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  const token = createToken(user.id, user.role, user.email);
  return { ...user, token };
};
