const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateTimesValidator = ajv.compile({
  type: 'object',
  properties: {
    fieldName: { type: 'string' },
    type: { type: 'string' },
    tag: { type: 'string' },
    actived: { type: 'boolean' },
  },
  required: ['fieldName', 'type', 'tag', 'actived'],
  additionalProperties: false,
});

const UpdateTimesValidator = ajv.compile({
  type: 'object',
  properties: {
    fieldName: { type: 'string' },
    type: { type: 'string' },
    tag: { type: 'string' },
    actived: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = { CreateTimesValidator, UpdateTimesValidator };
