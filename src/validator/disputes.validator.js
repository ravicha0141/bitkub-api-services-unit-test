const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateDisputeValidator = ajv.compile({
  type: 'object',
  properties: {
    assignmentId: { type: 'string' },
    evaluateId: { type: 'string' },
    agentEmail: { type: 'string' },
    qaAgent: { type: 'string' },
    groupId: { type: 'string' },
    agentReason: { type: 'string' },
    agentReasonDate: { type: 'number' },
    dateOfMonitoring: { type: 'number' },
  },
  required: ['agentEmail', 'evaluateId', 'qaAgent', 'assignmentId', 'groupId', 'agentReason', 'agentReasonDate'],
  additionalProperties: false,
});

const UpdateDisputeValidator = ajv.compile({
  type: 'object',
  properties: {
    qaReason: { type: 'string' },
    agentReason: { type: 'string' },
    qaReasonDate: { type: 'number' },
    agentReasonDate: { type: 'number' },
    taskNumber: { type: 'string' },
    superVisorEmail: { type: 'string' },
    disputeStatus: {
      type: 'string',
      default: 'pending',
      enum: ['pending', 'agreed', 'disagreed'],
    },
  },
  required: ['superVisorEmail'],
  additionalProperties: false,
});

module.exports = { CreateDisputeValidator, UpdateDisputeValidator };
