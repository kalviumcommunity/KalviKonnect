const prisma = require('../db');

exports.getCalendarEvents = async (req) => {
  return await prisma.$withRetry(async () => {
    // Aggregate real events from all modules
    const [hackathons, announcements] = await Promise.all([
      prisma.hackathon.findMany({
        where: { 
          OR: [
            { status: 'OPEN' },
            { status: 'ACTIVE' },
            { status: 'active' }
          ]
        },
        select: { id: true, title: true, deadline: true }
      }),
      prisma.announcement.findMany({
        select: { id: true, title: true, createdAt: true, isSticky: true }
      })
    ]);

    // Create Mock University Events to ensure calendar never looks empty
    const today = new Date();
    const mockEvents = [
      {
        id: 'mock-1',
        title: 'Kalvium Orientation Week',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        allDay: true,
        type: 'UNIVERSITY',
        color: '#8b5cf6' // Purple
      },
      {
         id: 'mock-2',
         title: 'Semester Midterm Holidays',
         start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
         end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18),
         allDay: true,
         type: 'UNIVERSITY',
         color: '#10b981' // Green
      },
      {
         id: 'mock-3',
         title: 'Career Workshop: Resume Building',
         start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 14, 0),
         end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 16, 0),
         allDay: false,
         type: 'WORKSHOP',
         color: '#f59e0b' // Amber
      }
    ];

    // Unified Calendar Event Mapping
    const events = [
      ...mockEvents,
      ...hackathons.map(h => ({
        id: h.id,
        title: `DEADLINE: ${h.title}`,
        start: h.deadline,
        allDay: true,
        type: 'HACKATHON',
        color: '#ef4444' // Kalvium Red
      })),
      ...announcements.map(a => ({
        id: a.id,
        title: `BROADCAST: ${a.title}`,
        start: a.createdAt,
        allDay: true,
        type: 'ANNOUNCEMENT',
        color: '#3b82f6' // Blue
      }))
    ];

    return events;
  });
};
