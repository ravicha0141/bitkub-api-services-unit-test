const { removingUndefined } = require('../utilities');

module.exports = {
  createAgentDTO: (doc) => {
    return {
      email: doc.email.toLowerCase(),
      username: doc.username,
      agentNumber: doc.agentNumber,
      employeeId: doc.employeeId,
      name: doc.name,
    };
  },
  updateAgentDTO: (doc) => {
    return {
      username: doc.username,
      name: doc.name,
      agentNumber: doc.agentNumber,
      employeeId: doc.employeeId,
    };
  },
  GetAgentQueryDTO: (doc) => {
    return removingUndefined({
      email: doc.email,
      agentNumber: doc.agentNumber,
      username: doc.username,
    });
  },
};
