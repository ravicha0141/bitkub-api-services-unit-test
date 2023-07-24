module.exports = {
  createGroupDTO: (doc) => {
    return {
      name: doc.groupName,
      tag: doc.groupName.replace(/\s/g, '').toLowerCase(),
    };
  },
  updateGroupDTO: (doc) => {
    return {
      name: doc.name,
      tag: doc.name.replace(/\s/g, '').toLowerCase(),
    };
  },
};
