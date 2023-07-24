const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');

const ReportOfAgentAndTeamPerfFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    groupId: { type: 'string', mongoObjectId: true },
    agentId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
  },
  required: ['trackType', 'formId', 'startDate', 'endDate'],
  additionalProperties: false,
});

const ReportOfQaTeamPerformanceFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    groupId: { type: 'string', mongoObjectId: true },
    qaAgentId: { type: 'string', mongoObjectId: true },
    view: { type: 'string', enum: ['ALL_WK', 'ALL_MM', 'ALL_YEAR'] },
  },
  required: ['trackType', 'formId', 'view'],
  additionalProperties: false,
});

const ReportOfQaTeamPerformanceDateCustomFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    groupId: { type: 'string', mongoObjectId: true },
    qaAgentId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
  },
  required: ['trackType', 'formId', 'startDate', 'endDate'],
  additionalProperties: false,
});

const ReportOfQaAgentPerformanceFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    groupId: { type: 'string', mongoObjectId: true },
    qaAgentId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
  },
  required: ['trackType', 'formId', 'startDate', 'endDate'],
  additionalProperties: false,
});

module.exports = {
  ReportOfAgentAndTeamPerfFilter,
  ReportOfQaTeamPerformanceFilter,
  ReportOfQaTeamPerformanceDateCustomFilter,
  ReportOfQaAgentPerformanceFilter,
};
