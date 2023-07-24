const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const concernIssueValidator = {
  type: 'object',
  properties: {
    order: { type: 'number' },
    value: { type: 'string' },
  },
  required: ['value', 'order'],
};

const itemValidator = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    detail: { type: 'string' },
    order: { type: 'number' },
  },
  required: ['title', 'detail', 'order'],
};

const listQuestionValidator = {
  type: 'object',
  properties: {
    order: { type: 'number' },
    title: { type: 'string' },
    detail: { type: 'string' },
    nonFatal: { type: 'boolean' },
    weight: { type: 'number' },
    listItems: {
      type: 'array',
      items: itemValidator,
      minItems: 1,
    },
  },
  required: ['order', 'title', 'detail', 'nonFatal', 'weight', 'listItems'],
};

const createCriteriaKycFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number' },
    concernIssues: { type: 'array', items: concernIssueValidator, minItems: 1 },
    listQuestions: { type: 'array', items: listQuestionValidator, minItems: 1 },
    errorTypes: { type: 'array', items: concernIssueValidator, minItems: 1 },
    futherExplanations: { type: 'array', items: concernIssueValidator },
  },
  required: ['name', 'targetScore', 'concernIssues', 'listQuestions', 'errorTypes', 'futherExplanations'],
  additionalProperties: false,
});

const updateAllCriteriaKycFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number' },
    concernIssues: { type: 'array', items: concernIssueValidator, minItems: 1 },
    listQuestions: { type: 'array', items: listQuestionValidator, minItems: 1 },
    errorTypes: { type: 'array', items: concernIssueValidator, minItems: 1 },
    futherExplanations: { type: 'array', items: concernIssueValidator },
    actived: { type: 'boolean' },
  },
  required: ['name', 'targetScore', 'concernIssues', 'listQuestions', 'actived', 'errorTypes', 'futherExplanations'],
  additionalProperties: false,
});

const updateSomeFieldCriteriaKycFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number' },
    concernIssues: { type: 'array', items: concernIssueValidator, minItems: 1 },
    listQuestions: { type: 'array', items: listQuestionValidator, minItems: 1 },
    errorTypes: { type: 'array', items: concernIssueValidator, minItems: 1 },
    futherExplanations: { type: 'array', items: concernIssueValidator },
    actived: { type: 'boolean' },
  },
  additionalProperties: false,
  required: [],
});

module.exports = {
  createCriteriaKycFormValidator,
  updateAllCriteriaKycFormValidator,
  updateSomeFieldCriteriaKycFormValidator,
};
