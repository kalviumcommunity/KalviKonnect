const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tags = ['Exams', 'React', 'Notes', 'Placements', 'Hackathons', 'Workshops'];
    console.log(`🌱 SEEDING ${tags.length} TAGS...`);
    
    for (const tagName of tags) {
        await prisma.tag.upsert({
            where: { id: `tag-${tagName.toLowerCase()}` },
            update: {},
            create: {
                id: `tag-${tagName.toLowerCase()}`,
                name: tagName
            }
        });
        console.log(`✅ SEEDED: ${tagName}`);
    }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
