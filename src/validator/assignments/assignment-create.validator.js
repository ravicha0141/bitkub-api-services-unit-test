const path = require('path');
const __dir = require('app-root-path');
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const AssignmentCreateValidation = ajv.compile({
  type: 'object',
  properties: {
    trackType: {
      type: 'string',
      enum: [TrackTypeEnum.BAD_ANALYSIS, TrackTypeEnum.KYC, TrackTypeEnum.QA_CS],
    },
    formId: { type: ['string', 'null'] },
    assignmentDateTime: { type: 'number' },
    qaAgentId: { type: 'string' },
    qaAgentName: { type: 'string' },
    qaAgentEmail: { type: 'string' },
    groupId: { type: 'string' },
    fileId: { type: ['string', 'null'] },
    fileName: { type: 'string' },
    fileKey: { type: 'string' },
    fileType: { type: 'string' },
    fileUri: { type: ['string', 'null'] },
    fileSize: { type: 'number' },
    agentId: { type: 'string' },
    agentEmail: { type: 'string' },
  },
  required: [
    'trackType',
    'formId',
    'assignmentDateTime',
    'qaAgentId',
    'qaAgentName',
    'qaAgentEmail',
    'groupId',
    'fileId',
    'fileName',
    'fileType',
    'fileUri',
    'fileSize',
    'agentId',
    'agentEmail',
  ],
  additionalProperties: false,
});

module.exports = { AssignmentCreateValidation };
