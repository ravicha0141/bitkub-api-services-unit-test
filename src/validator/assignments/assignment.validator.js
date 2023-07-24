const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const AssignmentUpdateAnyField = ajv.compile({
  type: 'object',
  properties: {
    agentEmail: { type: 'string' },
    netScore: { type: 'number' },
    status: { type: 'string', enum: ['pending', 'inprogress', 'completed'] },
    activated: { type: 'boolean' },
    varianced: { type: 'boolean' },
    varianceId: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = { AssignmentUpdateAnyField };
