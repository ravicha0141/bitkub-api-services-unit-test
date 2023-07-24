const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateProgressionValidator = ajv.compile({
  type: 'object',
  properties: {
    qaAgentId: { type: 'string' },
    type: { type: 'string', enum: ['on-duty'] },
    status: { type: 'boolean' },
    properties: { type: 'object' },
  },
  required: ['qaAgentId', 'type', 'status'],
  additionalProperties: false,
});
const UpdateProgressionValidator = ajv.compile({
  type: 'object',
  properties: {
    status: { type: 'boolean' },
    properties: { type: 'object' },
  },
  required: ['status'],
  additionalProperties: false,
});

module.exports = { CreateProgressionValidator, UpdateProgressionValidator };
