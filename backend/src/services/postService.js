const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createPost = async (content, userId, scope = 'COLLEGE') => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  return await prisma.post.create({
    data: {
      content,
      scope,
      author: { connect: { id: userId } },
      university: { connect: { id: user.universityId } }
    },
    include: {
      author: { select: { id: true, name: true, role: true } }
    }
  });
};

exports.getPosts = async (universityId, scope = 'COLLEGE', limit = 10, cursor = null) => {
  const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
  
  const where = {
    scope: scope
  };

  // If scope is COLLEGE, only show posts from user's university
  if (scope === 'COLLEGE') {
    where.universityId = universityId;
  }
  // If scope is KALVIUM, show all KALVIUM scope posts (public to network)

  const posts = await prisma.post.findMany({
    where,
    take: parsedLimit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, role: true } },
      _count: { select: { likes: true } }
    }
  });

  const hasNextPage = posts.length > parsedLimit;
  const data = hasNextPage ? posts.slice(0, parsedLimit) : posts;
  const nextCursor = hasNextPage ? data[data.length - 1].id : null;

  return {
    posts: data.map(p => ({
      ...p,
      likeCount: p._count.likes,
      _count: undefined
    })),
    nextCursor,
    hasNextPage
  };
};

exports.getPostById = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, role: true } },
      likes: { where: { userId: userId }, select: { id: true } }
    }
  });

  if (!post) throw new AppError('Post not found', 404);

  return {
    ...post,
    hasLiked: post.likes.length > 0,
    likes: undefined
  };
};

exports.deletePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);
  
  if (post.authorId !== userId) {
    throw new AppError('You do not have permission to delete this post', 403);
  }

  return await prisma.post.delete({ where: { id: postId } });
};

exports.toggleLike = async (postId, userId) => {
  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } }
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id }
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: { userId, postId }
    });
    return { liked: true };
  }
};
