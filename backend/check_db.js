require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  const unis = await prisma.university.findMany();
  console.log('User count:', count);
  console.log('Universities:', JSON.stringify(unis, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
