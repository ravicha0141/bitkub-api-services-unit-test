const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const ResultOfIssueOfBadValidaor = {
  type: 'object',
  properties: {
    referId: { type: 'string' },
    value: { type: 'string' },
  },
  required: ['referId', 'value'],
};

const ResultOfChoiceOfBadValidaor = {
  type: 'object',
  properties: {
    referId: { type: 'string' },
    choiceName: { type: 'string' },
    order: { type: 'number' },
  },
  required: ['referId', 'choiceName', 'order'],
};

const ResultOfReasonOfBadValidaor = {
  type: 'object',
  properties: {
    referId: { type: 'string' },
    choiceName: { type: 'string' },
    issues: ResultOfIssueOfBadValidaor,
    order: { type: 'number' },
  },
  required: ['referId', 'choiceName', 'order'],
};

const createResultOfBadAnalysisFormValidator = ajv.compile({
  type: 'object',
  properties: {
    evaluateId: { type: 'string' },
    qaAgentId: { type: 'string' },
    groupId: { type: 'string' },
    trackType: { type: 'string' },
    formId: { type: 'string' },
    groupName: { type: 'string' },
    qaAgentName: { type: 'string' },
    qaAgentEmail: { type: 'string' },
    targetScore: { type: 'number' },
    channelOfBad: ResultOfChoiceOfBadValidaor,
    reasonForBad: ResultOfReasonOfBadValidaor,
    issueForBad: ResultOfChoiceOfBadValidaor,
    organizationOfBad: ResultOfChoiceOfBadValidaor,
    suggestionForBad: { type: 'string' },
    result: { type: 'string' },
  },
  required: [
    'evaluateId',
    'qaAgentId',
    'groupId',
    'trackType',
    'formId',
    'groupName',
    'qaAgentName',
    'qaAgentEmail',
    'targetScore',
    'channelOfBad',
    'reasonForBad',
    'issueForBad',
    'organizationOfBad',
    'suggestionForBad',
    'result',
  ],
  additionalProperties: false,
});

const updateResultOfBadAnalysisFormValidator = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string' },
    formId: { type: 'string' },
    groupName: { type: 'string' },
    qaAgentName: { type: 'string' },
    qaAgentEmail: { type: 'string' },
    targetScore: { type: 'number' },
    channelOfBad: ResultOfChoiceOfBadValidaor,
    reasonForBad: ResultOfReasonOfBadValidaor,
    issueForBad: ResultOfChoiceOfBadValidaor,
    organizationOfBad: ResultOfChoiceOfBadValidaor,
    suggestionForBad: { type: 'string' },
    result: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = {
  createResultOfBadAnalysisFormValidator,
  updateResultOfBadAnalysisFormValidator,
};
