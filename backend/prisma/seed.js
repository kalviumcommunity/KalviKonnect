const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const universities = [
    { name: "Amrita Vishwa Vidyapeetham", city: "Coimbatore" },
    { name: "Lovely Professional University", city: "Phagwara" },
    { name: "KL University", city: "Guntur" },
    { name: "Chandigarh University", city: "Chandigarh" },
    { name: "VIT University", city: "Vellore" },
    { name: "SRM Institute of Science and Technology", city: "Chennai" },
    { name: "Manipal Institute of Technology", city: "Manipal" },
    { name: "JAIN University", city: "Bangalore" },
  ];

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { name: uni.name },
      update: {},
      create: {
        name: uni.name,
        location: uni.city
      }
    });
  }
  console.log('Universities seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
