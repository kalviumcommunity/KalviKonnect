const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function nuke() {
  console.log('🚮 Starting database purge...');
  try {
    // Delete in reverse order of dependency to avoid foreign key errors
    await prisma.discussionReply.deleteMany();
    await prisma.discussionThread.deleteMany();
    await prisma.noteTag.deleteMany();
    
    // We keep Tags as they are usually master data, but we clear their relations above
    // await prisma.tag.deleteMany(); 

    await prisma.bookmark.deleteMany();
    await prisma.like.deleteMany();
    await prisma.upvote.deleteMany();
    await prisma.hackathonApplication.deleteMany();
    await prisma.hackathon.deleteMany();
    await prisma.note.deleteMany();
    await prisma.placementPost.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.notification.deleteMany();

    console.log('✅ Success! All learning, placement, and interaction data has been cleared.');
    console.log('ℹ️ User accounts and University profiles remain intact.');
  } catch (error) {
    if (error.message.includes('Inconsistent query')) {
        console.warn('⚠️ Some tables were already empty or missing relationships. Continuing...');
    } else {
        console.error('❌ Failed to purge data:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

nuke();
