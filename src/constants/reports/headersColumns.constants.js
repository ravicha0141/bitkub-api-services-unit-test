const FeedbackReportColumnArray = [
  'trackType',
  'formName',
  'groupName',
  'month',
  'week',
  'agentName',
  'bpo',
  'uid',
  'ticketNo',
  'assignmentRef',
  'fileType',
  'language',
  'dateOfCall',
  'timeOfCall',
  'qcOwner',
  'monitoringDate',
  'monitoringTime',
  'voiceTime',
  'P_%',
  'P_Grade',
];
const FeedbackReportColumnAdditionalArray = [
  'areaOfStrength',
  'areaOfImprovement',
  'errorTypeValue',
  'concernIssueValue',
  'futherExplanationValue',
];

const VariancesColumnArray = ['level', 'inspection'];
const DisputeCollectingColumnArray = [
  'level',
  'qaUsername',
  'agentEmail',
  'superVisorEmail',
  'agentReason',
  'qaReason',
  'week',
  'month',
  'status',
];
module.exports = { VariancesColumnArray, DisputeCollectingColumnArray, FeedbackReportColumnArray, FeedbackReportColumnAdditionalArray };
