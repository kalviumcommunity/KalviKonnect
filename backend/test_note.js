const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    console.log('🚀 TESTING NOTE CREATION...');
    const userId = 'e41059e0-6da7-4ddc-b8c3-f2f5ef8a4aa8';
    const univId = 'univ-default-123';
    
    try {
        const note = await prisma.note.create({
            data: {
                title: 'Test Note',
                content: 'Test content',
                semester: 1,
                university: { connect: { id: univId } },
                author: { connect: { id: userId } },
                tags: {
                    create: []
                }
            }
        });
        console.log('✅ SUCCESS! Note created with ID:', note.id);
    } catch (err) {
        console.error('❌ PRISMA FAILED:', err);
    }
}

test().finally(() => prisma.$disconnect());
