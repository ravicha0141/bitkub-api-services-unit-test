const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const listValueValidator = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    type: { type: 'string' },
    value: { type: ['string', 'number', 'boolean'] },
  },
  required: ['field', 'type', 'value'],
};

const createResultOfCriteriaQaCsValidator = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string' },
    assignmentId: { type: 'string' },
    referFrom: { type: 'string' },
    referId: { type: 'string' },
    referOrder: { type: 'string' },
    referTitle: { type: 'string' },
    referDetail: { type: 'string' },
    values: { type: 'array', items: listValueValidator, minItems: 1 },
    comment: { type: 'string' },
    tags: { type: 'object' },
  },
  required: ['trackType', 'assignmentId', 'referFrom', 'referId', 'referOrder', 'referTitle', 'referDetail', 'values', 'comment'],
  additionalProperties: false,
});

const updateResultOfCriteriaQaCsValidator = ajv.compile({
  type: 'object',
  properties: {
    referOrder: { type: 'string' },
    referTitle: { type: 'string' },
    referDetail: { type: 'string' },
    values: { type: 'array', items: listValueValidator, minItems: 1 },
    comment: { type: 'string' },
    tags: { type: 'object' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = {
  createResultOfCriteriaQaCsValidator,
  updateResultOfCriteriaQaCsValidator,
};
