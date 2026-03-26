const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with placements for slow query exercise...');

  // 1. Create a dummy university if not exists
  let uni = await prisma.university.findFirst({ where: { name: 'Tech University' } });
  if (!uni) {
    uni = await prisma.university.create({
      data: { name: 'Tech University', location: 'City Center' }
    });
  }

  // 2. Create a dummy author
  let author = await prisma.user.findFirst({ where: { email: 'seeder@tech.edu' } });
  if (!author) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    author = await prisma.user.create({
      data: {
        email: 'seeder@tech.edu',
        name: 'Seed User',
        password: hashedPassword,
        role: 'STUDENT',
        universityId: uni.id
      }
    });
  }

  // 3. Delete existing placements by this author purely to reset cleanly?
  // Let's just blindly add 50,000 more records each time it runs for simplicity.

  const batchSize = 5000;
  const numBatches = 10;
  const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Adobe', 'Intel', 'IBM'];
  const roles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'];

  console.log(`Starting to seed ${batchSize * numBatches} placement records...`);
  
  for (let i = 0; i < numBatches; i++) {
    const placements = [];
    for (let j = 0; j < batchSize; j++) {
      const company = companies[Math.floor(Math.random() * companies.length)] + ' ' + Math.floor(Math.random() * 1000);
      const role = roles[Math.floor(Math.random() * roles.length)];
      placements.push({
        company,
        role,
        content: `Interview experience for ${role} at ${company}...`,
        authorId: author.id,
      });
    }

    await prisma.placementPost.createMany({
      data: placements,
    });
    console.log(`Batch ${i + 1}/${numBatches} completed.`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
