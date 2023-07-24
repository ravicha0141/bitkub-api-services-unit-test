const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const listQuestionValidator = {
  type: 'object',
  properties: {
    questionId: { type: 'string' },
    nonFatal: { type: 'boolean' },
    weightageScore: { type: 'number' },
    result: { type: 'string' },
    comments: { type: 'array', items: { type: 'string' } },
    concernIssueValue: { type: 'string' },
    errorTypeValue: { type: 'string' },
    futherExplanationValue: { type: 'string' },
    qaNoteValue: { type: 'string' },
    varianceResult: { type: 'boolean' },
    supQaComment: { type: 'string' },
  },
  required: [
    'questionId',
    'nonFatal',
    'weightageScore',
    'result',
    'comments',
    'concernIssueValue',
    'errorTypeValue',
    'futherExplanationValue',
    'qaNoteValue',
    'supQaComment',
  ],
};

const createResultOfCriteriaKycValidator = ajv.compile({
  type: 'object',
  properties: {
    evaluateId: { type: 'string' },
    totalWeight: { type: 'number' },
    netScore: { type: 'number' },
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    listQuestions: { type: 'array', items: listQuestionValidator, minItems: 1 },
  },
  required: ['evaluateId', 'totalWeight', 'netScore', 'areaOfStrength', 'areaOfImprovement', 'listQuestions'],
  additionalProperties: false,
});

const updateResultOfCriteriaKycValidator = ajv.compile({
  type: 'object',
  properties: {
    totalWeight: { type: 'number' },
    netScore: { type: 'number' },
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    listQuestions: { type: 'array', items: listQuestionValidator },
  },
  required: [],
  additionalProperties: false,
});

module.exports = {
  createResultOfCriteriaKycValidator,
  updateResultOfCriteriaKycValidator,
};
