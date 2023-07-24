const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');

const ReportOfDisputeCollectingFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    team: { type: 'string', enum: ['TEAM', 'ALL'] },
    groupId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
  },
  required: ['trackType', 'formId', 'team', 'startDate', 'endDate'],
  additionalProperties: false,
});

module.exports = { ReportOfDisputeCollectingFilter };
