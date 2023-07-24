module.exports = {
  createVarianceDTO: (doc) => {
    return {
      formId: doc.formId,
      evaluateId: doc.evaluateId,
      assignmentId: doc.assignmentId,
      taskNumber: doc.taskNumber,
      assignmentRef: doc.assignmentRef,
      trackType: doc.trackType,
      groupId: doc.groupId,
      agentId: doc.agentId,
      agentEmail: doc.agentEmail,
      agentName: doc.agentName,
      agentEmployeeId: doc.agentEmployeeId,
      fileId: doc.fileId,
      fileType: doc.fileType,
      fileName: doc.fileName,
      targetScore: doc.targetScore,
      qaAgentId: doc.qaAgentId,
      qaAgentEmail: doc.qaAgentEmail,
      superVisorId: doc.superVisorId,
      superVisorEmail: doc.superVisorEmail,
      fatalDeduction: doc.fatalDeduction,
      monitoringDate: doc.monitoringDate,
      monitoringTime: doc.monitoringDate,
      note: doc.note,
      internalNote: doc.internalNote,
      tags: doc.tags,
      result: doc.result,
      differenceValue: doc.differenceValue,
    };
  },
  updateVarianceDTO: (doc) => {
    return {
      isDispute: doc.isDispute,
      status: doc.status,
      netScore: doc.netScore,
      areaOfStrength: doc.areaOfStrength,
      areaOfImprovement: doc.areaOfImprovement,
      tags: doc.tags,
      internalNote: doc.internalNote,
      result: doc.result,
      differenceValue: doc.differenceValue,
    };
  },
  createResultVarianceDTO: (doc) => {
    return {
      assignmentId: doc.assignmentId,
      evaluateId: doc.evaluateId,
      referFrom: doc.referFrom,
      referId: doc.referId,
      referTitle: doc.referTitle,
      referDetail: doc.referDetail,
      values: doc.values,
      tags: doc.tags,
    };
  },
  updateResultVarianceDTO: (doc) => {
    return {
      referTitle: doc.referTitle,
      referDetail: doc.referDetail,
      values: doc.values,
      tags: doc.tags,
    };
  },
  QueryVarianceDTO: (doc) => {
    return {
      formId: doc.formId,
      assignmentId: doc.assignmentId,
      evaluateId: doc.evaluateId,
      taskNumber: doc.taskNumber,
      assignmentRef: doc.assignmentRef,
      trackType: doc.trackType,
      groupId: doc.groupId,
      agentId: doc.agentId,
      fileId: doc.fileId,
      qaAgentId: doc.qaAgentId,
      differenceValue: doc.differenceValue,
    };
  },
};
