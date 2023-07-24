const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateApprovalsValidator = ajv.compile({
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    settingMemu: { type: 'object' },
    settingReport: { type: 'object' },
    settingExport: { type: 'object' },
  },
  required: ['groupId', 'settingMemu', 'settingReport', 'settingExport'],
  additionalProperties: false,
});

const UpdateApprovalsValidator = ajv.compile({
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    rejected: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
});
module.exports = { CreateApprovalsValidator, UpdateApprovalsValidator };
