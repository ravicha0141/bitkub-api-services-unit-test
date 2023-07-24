module.exports = {
  updateApprovalDTO: (doc) => {
    return {
      approved: doc.approved,
      rejected: doc.rejected,
    };
  },
};
