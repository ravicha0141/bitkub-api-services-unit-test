const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const AgentQueryFilterValidator = ajv.compile({
  type: 'object',
  properties: {
    groupIsNull: { type: 'string' },
    email: { type: 'string' },
    agentNumber: { type: 'string' },
    username: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
});

const CreateAgentValidator = ajv.compile({
  type: 'object',
  properties: {
    agentNumber: { type: 'string', maxLength: 6, minLength: 6 },
    employeeId: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['employeeId', 'agentNumber', 'email'],
  additionalProperties: false,
});

module.exports = { AgentQueryFilterValidator, CreateAgentValidator };
