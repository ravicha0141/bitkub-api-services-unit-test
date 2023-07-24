const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const IssueOfBadValidaor = {
  type: 'object',
  properties: {
    value: { type: 'string' },
    order: { type: 'number' },
  },
  required: ['value', 'order'],
};

const ChoiceOfBadValidaor = {
  type: 'object',
  properties: {
    choiceName: { type: 'string' },
    order: { type: 'number' },
  },
  required: ['choiceName', 'order'],
};

const ChoiceWithIssueOfBadValidaor = {
  type: 'object',
  properties: {
    choiceName: { type: 'string' },
    issues: {
      type: 'array',
      items: IssueOfBadValidaor,
    },
    order: { type: 'number' },
  },
  required: ['choiceName', 'issues', 'order'],
};

const createBadAnalysisFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    trackType: { type: 'string' },
    targetScore: { type: 'number' },
    channelOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    reasonForBad: { type: 'array', items: ChoiceWithIssueOfBadValidaor, minItems: 1 },
    issueForBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    organizationOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
  },
  required: ['name', 'trackType', 'targetScore', 'channelOfBad', 'reasonForBad', 'issueForBad', 'organizationOfBad'],
  additionalProperties: false,
});

const updateAllBadAnalysisFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number' },
    channelOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    reasonForBad: { type: 'array', items: ChoiceWithIssueOfBadValidaor, minItems: 1 },
    issueForBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    organizationOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    actived: { type: 'boolean' },
  },
  required: ['name', 'targetScore', 'channelOfBad', 'reasonForBad', 'issueForBad', 'organizationOfBad', 'actived'],
  additionalProperties: false,
});

const updateSomeFieldBadAnalysisFormValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    targetScore: { type: 'number' },
    channelOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    reasonForBad: { type: 'array', items: ChoiceWithIssueOfBadValidaor, minItems: 1 },
    issueForBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    organizationOfBad: { type: 'array', items: ChoiceOfBadValidaor, minItems: 1 },
    actived: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
});

module.exports = {
  createBadAnalysisFormValidator,
  updateAllBadAnalysisFormValidator,
  updateSomeFieldBadAnalysisFormValidator,
};
