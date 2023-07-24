const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateIssuesValidator = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    detail: { type: 'string' },
    weight: { type: 'number' },
    properties: { type: 'object' },
  },
  required: ['title', 'detail'],
  additionalProperties: false,
});

module.exports = { CreateIssuesValidator };
