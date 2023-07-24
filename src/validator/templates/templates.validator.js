const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateTemplateValidator = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    targetScore: { type: 'number', default: 100 },
    tag: {
      type: 'string',
      enum: ['criteria-kyc', 'criteria-qa-cs'],
    },
  },
  required: ['title', 'targetScore', 'tag'],
  additionalProperties: true,
});

const UpdateTemplateValidator = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    targetScore: { type: 'number' },
    listQuestions: { type: 'array' },
    properties: { type: 'object' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = { CreateTemplateValidator, UpdateTemplateValidator };
