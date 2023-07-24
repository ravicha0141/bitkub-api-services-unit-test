const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateMemberValidator = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string', mongoObjectId: true },
    name: { type: 'string' },
    email: { type: 'string' },
    role: {
      type: 'string',
      enum: ['agent', 'qaAgent', 'superVisor', 'assistManager'],
    },
  },
  required: ['userId', 'name', 'email', 'role'],
  additionalProperties: false,
});
const UpdateMemberValidator = ajv.compile({
  type: 'object',
  properties: {
    assignmentId: { type: 'string' },
    trackType: { type: 'string' },
    qaAgentId: { type: 'string' },
    agentId: { type: 'string' },
    agentEmail: { type: 'string' },
    agentName: { type: 'string' },
    fileId: { type: 'string' },
    fileType: { type: 'string' },
    targetScore: { type: 'number' },
    fatalDeduction: { type: 'string' },
    monitoringDate: { type: 'number' },
    monitoringTime: { type: 'number' },
    netScore: { type: 'number' },
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    note: { type: 'string' },
    tags: { type: 'object' },
  },
  required: ['assignmentId', 'agentId', 'fileId', 'qaAgentId', 'monitoringDate', 'netScore'],
  additionalProperties: false,
});

module.exports = { CreateMemberValidator, UpdateMemberValidator };
