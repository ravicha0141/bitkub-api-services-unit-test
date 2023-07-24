const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateGroupsValidator = ajv.compile({
  type: 'object',
  properties: {
    groupName: { type: 'string', isEngTextWithWhiteSpace: true },
  },
  required: ['groupName'],
  additionalProperties: false,
});

const UpdateGroupsValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string', isEngTextWithWhiteSpace: true },
  },
  required: ['name'],
  additionalProperties: false,
});

const CreateAuthorityValidator = ajv.compile({
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    settingMemu: {
      type: 'object',
      properties: {
        assignmentAllowed: { type: 'boolean' },
        agentProductivityAllowed: { type: 'boolean' },
        dailyTaskAllowed: { type: 'boolean' },
        disputeFunctionAllowed: { type: 'boolean' },
        templateAndCustimizeAllowed: { type: 'boolean' },
        reportAllowed: { type: 'boolean' },
        settingAllowed: { type: 'boolean' },
      },
      required: [
        'assignmentAllowed',
        'agentProductivityAllowed',
        'dailyTaskAllowed',
        'disputeFunctionAllowed',
        'templateAndCustimizeAllowed',
        'reportAllowed',
        'settingAllowed',
      ],
    },
    settingReport: {
      type: 'object',
      properties: {
        agentAndteamPerformanceReportAllowed: { type: 'boolean' },
        complianceAndNonComplianceTeamAnalysisAllowed: {
          type: 'boolean',
        },
        qaAgentAndTeamPerformanceAllowed: { type: 'boolean' },
        disputeCollectingReportAllowed: { type: 'boolean' },
        feedbackAllowed: { type: 'boolean' },
        badAnalysisAllowed: { type: 'boolean' },
        varianceReportAllowed: { type: 'boolean' },
      },
      required: [
        'agentAndteamPerformanceReportAllowed',
        'complianceAndNonComplianceTeamAnalysisAllowed',
        'qaAgentAndTeamPerformanceAllowed',
        'disputeCollectingReportAllowed',
        'feedbackAllowed',
        'badAnalysisAllowed',
        'varianceReportAllowed',
      ],
    },
    settingExport: {
      type: 'object',
      properties: {
        agentAndteamPerformanceReport: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
        complianceAndNonComplianceTeamAnalysis: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
        qaAgentAndTeamPerformance: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
        disputeCollectingReport: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
        feedback: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
        badAnalysis: {
          type: 'object',
          properties: {
            pdfAllowed: { type: 'boolean' },
            excelAllowed: { type: 'boolean' },
          },
          required: ['pdfAllowed', 'excelAllowed'],
        },
      },
      required: [
        'agentAndteamPerformanceReport',
        'complianceAndNonComplianceTeamAnalysis',
        'qaAgentAndTeamPerformance',
        'disputeCollectingReport',
        'feedback',
        'badAnalysis',
      ],
    },
  },
  required: ['settingMemu', 'settingReport', 'settingExport'],
  additionalProperties: false,
});

module.exports = { CreateGroupsValidator, UpdateGroupsValidator, CreateAuthorityValidator };
