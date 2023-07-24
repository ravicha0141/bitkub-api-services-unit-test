const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateQuestionValidator = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    order: { type: 'string' },
    weight: { type: 'number' },
    detail: { type: 'string' },
    listQuestions: { type: 'array' },
  },
  required: ['title', 'detail', 'order'],
  additionalProperties: false,
});

module.exports = { CreateQuestionValidator };
