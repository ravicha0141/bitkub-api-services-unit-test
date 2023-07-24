const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));
const schema = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    rejected: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
};

module.exports = ajv.compile(schema);
