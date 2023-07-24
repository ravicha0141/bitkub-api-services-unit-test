const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const ReportOfBadAnalysisFilterTypeOne = ajv.compile({
  type: 'object',
  properties: {
    formId: { type: 'string', mongoObjectId: true },
    frequency: { type: 'string', enum: ['ALL_WK', 'ALL_MM', 'ALL_YEAR'] },
    team: { type: 'string', enum: ['TEAM', 'ALL'] },
    groupId: { type: 'string', mongoObjectId: true },
  },
  required: ['formId', 'frequency', 'team'],
  additionalProperties: false,
});

const ReportOfBadAnalysisFilterTypeTwo = ajv.compile({
  type: 'object',
  properties: {
    formId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
  },
  required: ['startDate', 'endDate'],
  additionalProperties: false,
});

const ReportOfBadAnalysisFilterTypeThere = ajv.compile({
  type: 'object',
  properties: {
    formId: { type: 'string', mongoObjectId: true },
    frequency: { type: 'string', enum: ['ALL_WK', 'ALL_MM', 'ALL_YEAR'] },
    groupId: { type: 'string', mongoObjectId: true },
    reasonForBad: { type: 'string', mongoObjectId: true },
  },
  required: ['formId', 'frequency', 'reasonForBad'],
  additionalProperties: false,
});

module.exports = { ReportOfBadAnalysisFilterTypeOne, ReportOfBadAnalysisFilterTypeTwo, ReportOfBadAnalysisFilterTypeThere };
