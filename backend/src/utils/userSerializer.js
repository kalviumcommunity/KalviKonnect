const userSerializer = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    universityId: user.universityId,
  };
};

module.exports = userSerializer;
