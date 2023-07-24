module.exports = {
  createAssignmentDTO: (doc) => {
    return {
      trackType: doc.trackType,
      formId: doc.formId,
      assignDate: doc.assignDate,
      assignmentDateTime: doc.assignmentDateTime,
      qaAgentId: doc.qaAgentId,
      qaAgentName: doc.qaAgentName,
      qaAgentEmail: doc.qaAgentEmail.toLowerCase(),
      groupId: doc.groupId,
      groupName: doc.groupName,
      fileId: doc.fileId,
      fileType: doc.fileType,
      fileName: doc.fileName,
      fileKey: doc.fileKey,
      fileUri: doc.fileUri,
      fileSize: doc.fileSize,
      agentId: doc.agentId,
      agentEmail: doc.agentEmail ? doc.agentEmail.toLowerCase() : null,
    };
  },
  updateAssignmentDTO: (doc) => {
    return {
      agentId: doc.agentId,
      agentEmail: doc.agentEmail,
      netScore: doc.netScore,
      status: doc.status,
      completedDate: doc.status === 'completed' ? new Date() : null,
      activated: doc.activated,
      varianced: doc.varianced,
      varianceId: doc.varianceId,
    };
  },
};
