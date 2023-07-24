const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateItemValidator = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    detail: { type: 'string' },
    weight: { type: 'number' },
    faltalNonFaltal: { type: 'string' },
    order: { type: 'string' },
    properties: { type: 'object' },
  },
  required: ['title', 'detail', 'order'],
  additionalProperties: false,
});

module.exports = { CreateItemValidator };
