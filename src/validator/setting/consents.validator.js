const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateConsentsValidator = ajv.compile({
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    groupName: { type: 'string' },
    userRequest: { type: 'string' },
    changeListts: { type: 'array' },
  },
  required: ['groupId', 'groupName', 'userRequest', 'changeListts'],
  additionalProperties: false,
});

const UpdateConsentsValidator = ajv.compile({
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
    achieved: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = { CreateConsentsValidator, UpdateConsentsValidator };
