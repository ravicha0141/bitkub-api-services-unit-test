const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateEvaluateValidator = ajv.compile({
  type: 'object',
  properties: {
    assignmentId: { type: 'string' },
    trackType: { type: 'string' },
    agentId: { type: 'string' },
    qaAgentId: { type: 'string' },
    fileId: { type: ['string', 'null'] },
    targetScore: { type: 'number' },
    monitoringDate: { type: 'number' },
    monitoringTime: { type: 'number' },
    status: { type: 'string' },
    note: { type: 'string' },
    internalNote: { type: 'string' },
    tags: { type: 'object' },
  },
  required: ['assignmentId', 'trackType', 'agentId', 'qaAgentId', 'fileId', 'targetScore', 'monitoringTime', 'monitoringDate'],
  additionalProperties: false,
});

const UpdateEvaluateValidator = ajv.compile({
  type: 'object',
  properties: {
    isDispute: { type: 'boolean' },
    status: { type: 'string' },
    netScore: { type: 'number' },
    percentage: { type: 'number' },
    totalWeight: { type: 'number' },
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    bpo: { type: 'string' },
    language: { type: 'string' },
    uid: { type: 'string' },
    dateOfCall: { type: 'string' },
    timeOfCall: { type: 'string' },
    tags: { type: 'object' },
    internalNote: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
});

const CreateResultOfEvaluateValidator = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string' },
    assignmentId: { type: 'string' },
    referFrom: { type: 'string', enum: ['question', 'item'] },
    referId: { type: 'string' },
    referOrder: { type: 'string', default: '' },
    referTitle: { type: 'string', default: '' },
    referDetail: { type: 'string', default: '' },
    comment: { type: 'string', default: '' },
    values: { type: 'array' },
    tags: { type: 'object' },
  },
  required: ['trackType', 'assignmentId', 'referFrom', 'referId', 'referOrder', 'referTitle', 'referDetail', 'values'],
  additionalProperties: false,
});

module.exports = { CreateEvaluateValidator, UpdateEvaluateValidator, CreateResultOfEvaluateValidator };
