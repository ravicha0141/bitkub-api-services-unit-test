module.exports = {
  createDisputeDTO: (doc) => {
    return {
      formId: doc.formId,
      trackType: doc.trackType,
      assignmentId: doc.assignmentId,
      evaluateId: doc.evaluateId,
      agentEmail: doc.agentEmail.toLowerCase(),
      qaAgent: doc.qaAgent,
      taskNumber: doc.taskNumber,
      groupId: doc.groupId,
      superVisorEmail: '',
      agentReason: doc.agentReason,
      agentReasonDate: doc.agentReasonDate,
      dateOfMonitoring: doc.dateOfMonitoring,
    };
  },
  updateDisputeDTO: (doc) => {
    return {
      qaReason: doc.qaReason,
      qaReasonDate: doc.qaReasonDate,
      superVisorEmail: doc.superVisorEmail.toLowerCase(),
      disputeStatus: doc.disputeStatus,
      taskNumber: doc.taskNumber,
    };
  },
};
