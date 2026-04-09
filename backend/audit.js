const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 COMMENCING FORENSIC DATABASE AUDIT...');
    
    // 1. Check Universities
    const universities = await prisma.university.findMany();
    console.log(`✅ FOUND ${universities.length} UNIVERSITIES.`);
    if (universities.length > 0) {
        console.log('--- CAMPUS LIST ---');
        universities.forEach(u => console.log(`- ${u.name} (ID: ${u.id})`));
    } else {
        console.warn('⚠️ CRITICAL: NO UNIVERSITIES FOUND. Creating default Kalvium campus...');
        const u = await prisma.university.create({ data: { name: 'Kalvium Main Campus', location: 'Remote' } });
        console.log(`✅ CREATED: ${u.name} (ID: ${u.id})`);
    }

    // 2. Check Users
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, universityId: true } });
    console.log(`✅ FOUND ${users.length} USERS.`);
    users.forEach(u => {
        console.log(`- ${u.name} | Campus Linked: ${u.universityId ? 'YES' : '🔴 NO'}`);
    });

}

main()
  .catch(e => {
    console.error('❌ AUDIT FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
