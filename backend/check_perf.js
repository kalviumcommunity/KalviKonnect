const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.placementPost.count();
  console.log('PlacementPost count:', count);

  const explain = await prisma.$queryRawUnsafe(`EXPLAIN ANALYZE SELECT * FROM "PlacementPost" WHERE company ILIKE '%Google%' LIMIT 10 OFFSET 0;`);
  console.log('EXPLAIN ANALYZE for Placement company search:');
  console.table(explain);

  // Dashboard dual feed simulation
  // Note: universityId and visibility
  const uni = await prisma.university.findFirst();
  if (uni) {
    const explainDashboard = await prisma.$queryRawUnsafe(`EXPLAIN ANALYZE SELECT * FROM "Note" WHERE "universityId" = '${uni.id}' AND "visibility" = 'UNIVERSITY_ONLY' ORDER BY "createdAt" DESC LIMIT 10;`);
    console.log('EXPLAIN ANALYZE for Dashboard Note feed:');
    console.table(explainDashboard);
  }

  // Learning Content filter simulation
  const tag = await prisma.tag.findFirst();
  if (tag) {
    const explainNotes = await prisma.$queryRawUnsafe(`EXPLAIN ANALYZE SELECT n.* FROM "Note" n JOIN "NoteTag" nt ON n.id = nt."noteId" WHERE nt."tagId" = '${tag.id}' AND n."universityId" = '${uni.id}' ORDER BY n."createdAt" DESC LIMIT 10;`);
    console.log('EXPLAIN ANALYZE for Notes by Tag:');
    console.table(explainNotes);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
