const prisma = require('../db');

const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const query = q.trim();
    const universityId = req.user.universityId;

    // Parallel search across all major modules
    const [notes, placements, threads, hackathons] = await Promise.all([
      prisma.note.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { visibility: 'PUBLIC' },
                { 
                  AND: [
                    { visibility: 'UNIVERSITY_ONLY' },
                    { universityId: universityId }
                  ]
                }
              ]
            }
          ]
        },

        take: 5,
        select: { id: true, title: true, semester: true }
      }),
      prisma.placementPost.findMany({
        where: {
          OR: [
            { company: { contains: query, mode: 'insensitive' } },
            { role: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ],
          // Only show placements from the same university for localized advice
          author: { universityId: universityId }
        },
        take: 5,
        select: { id: true, company: true, role: true }
      }),
      prisma.discussionThread.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: { id: true, title: true }
      }),
      prisma.hackathon.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          deadline: { gte: new Date() } // Only show active hackathons
        },
        take: 5,
        select: { id: true, title: true }
      })
    ]);


    // Unify results
    const results = [
      ...notes.map(n => ({ id: n.id, title: n.title, type: 'NOTE', link: `/notes/${n.id}`, subtitle: `Semester ${n.semester}` })),
      ...placements.map(p => ({ id: p.id, title: `${p.company} Interview`, type: 'PLACEMENT', link: `/placements/${p.id}`, subtitle: p.role })),
      ...threads.map(t => ({ id: t.id, title: t.title, type: 'DISCUSSION', link: `/discussions/${t.id}`, subtitle: 'Forum Thread' })),
      ...hackathons.map(h => ({ id: h.id, title: h.title, type: 'HACKATHON', link: `/hackathons`, subtitle: 'Open Challenge' }))
    ];

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { globalSearch };
