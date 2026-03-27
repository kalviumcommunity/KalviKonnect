const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.placementPost.findMany({
      skip: 0,
      take: 10,
      select: {
        id: true,
        company: true,
        role: true,
        createdAt: true,
        upvoteCount: true,
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    console.log('Success:', result.length);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

test().finally(() => prisma.$disconnect());
