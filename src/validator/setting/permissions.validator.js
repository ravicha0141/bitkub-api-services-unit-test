const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const createPermissionValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    key: { type: 'string' },
  },
  required: ['name', 'key'],
  additionalProperties: false,
});

const updatePermissionValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    key: { type: 'string' },
  },
  required: ['name', 'key'],
  additionalProperties: false,
});
module.exports = { createPermissionValidator, updatePermissionValidator };
