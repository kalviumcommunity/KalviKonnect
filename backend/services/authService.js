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

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      university: { connect: { id: universityId } },
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
