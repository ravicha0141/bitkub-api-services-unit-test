const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');

const ReportOfCompliantAndNoncompliantFilter = ajv.compile({
  type: 'object',
  properties: {
    trackType: { type: 'string', enum: [TrackTypeEnum.QA_CS, TrackTypeEnum.KYC] },
    formId: { type: 'string', mongoObjectId: true },
    groupId: { type: 'string', mongoObjectId: true },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    view: { type: 'string', enum: ['DATE', 'WEEK'] },
  },
  required: ['trackType', 'formId', 'startDate', 'endDate', 'view'],
  additionalProperties: false,
});

module.exports = { ReportOfCompliantAndNoncompliantFilter };
