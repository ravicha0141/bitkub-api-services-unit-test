module.exports = {
  createProgressionDTO: (doc) => {
    try {
      return {
        qaAgentId: doc.qaAgentId,
        qaAgentEmail: doc.qaAgentEmail.toLowerCase(),
        groupId: doc.groupId,
        groupName: doc.groupName,
        type: doc.type,
        date: doc.date.toString(),
        status: doc.status,
        startTime: doc.startTime,
        endTime: doc.endTime,
        amount: doc.amount,
        properties: JSON.parse(JSON.stringify(doc.properties)),
      };
    } catch (error) {
      return false;
    }
  },
  updateProgressionDTO: (doc) => {
    return {
      status: doc.status,
      endTime: doc.endTime,
      amount: doc.amount,
      groupId: doc.groupId,
      groupName: doc.groupName,
      properties: JSON.parse(JSON.stringify(doc.properties)),
    };
  },
};
