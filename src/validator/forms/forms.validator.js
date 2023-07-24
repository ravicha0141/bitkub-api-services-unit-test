const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateFormPayloadValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number', default: 100 },
    trackType: {
      type: 'string',
      enum: ['criteria-kyc', 'criteria-qa-cs'],
    },
  },
  required: ['name', 'targetScore', 'trackType'],
  additionalProperties: true,
});

const UpdateAnyFormPayloadValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number', default: 100 },
  },
  required: [],
  additionalProperties: true,
});
module.exports = { CreateFormPayloadValidator, UpdateAnyFormPayloadValidator };
