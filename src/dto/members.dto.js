module.exports = {
  createMemberDTO: (doc) => {
    return {
      groupId: doc.groupId,
      userId: doc.userId,
      name: doc.name,
      email: doc.email.toLowerCase(),
      role: doc.role,
    };
  },
};
