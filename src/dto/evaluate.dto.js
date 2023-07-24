module.exports = {
  createEvaluateDTO: (doc) => {
    return {
      formId: doc.formId,
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
      fileKey: doc.fileKey,
      fileSize: doc.fileSize,
      targetScore: doc.targetScore,
      qaAgentId: doc.qaAgentId,
      qaAgentEmail: doc.qaAgentEmail,
      fatalDeduction: doc.fatalDeduction,
      monitoringDate: doc.monitoringDate,
      monitoringTime: doc.monitoringDate,
      note: doc.note,
      internalNote: doc.internalNote,
      tags: doc.tags,
      result: doc.result,
    };
  },
  updateEvaluateDTO: (doc) => {
    return {
      isDispute: doc.isDispute,
      status: doc.status,
      netScore: doc.netScore,
      percentage: doc.percentage,
      totalWeight: doc.totalWeight,
      areaOfStrength: doc.areaOfStrength,
      areaOfImprovement: doc.areaOfImprovement,
      bpo: doc.bpo,
      language: doc.language,
      uid: doc.uid,
      dateOfCall: doc.dateOfCall,
      timeOfCall: doc.timeOfCall,
      tags: doc.tags,
      internalNote: doc.internalNote,
      result: doc.result,
    };
  },
  createResultEvaluateDTO: (doc) => {
    return {
      assignmentId: doc.assignmentId,
      evaluateId: doc.evaluateId,
      referId: doc.referId,
      referFrom: doc.referFrom,
      referOrder: doc.referOrder,
      referTitle: doc.referTitle,
      referDetail: doc.referDetail,
      values: doc.values,
      comment: doc.comment,
      tags: doc.tags,
    };
  },
  updateResultEvaluateOfQaCsDTO: (doc) => {
    return {
      referOrder: doc.referOrder,
      referTitle: doc.referTitle,
      referDetail: doc.referDetail,
      values: doc.values,
      comment: doc.comment,
      tags: doc?.tags,
    };
  },
  onBreakTimeInEvaluateDTO: (doc) => {
    return {
      onBreakTimeId: doc._id,
      action: doc.action,
      startDate: doc.startDate,
      endDate: doc.endDate || null,
      amount: doc.amount || null,
      archived: doc.amount || false,
    };
  },
};
