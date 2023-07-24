const path = require('path');
const __dir = require('app-root-path');
const { OnBreakTimeEnumLists } = require('../../constants/evaluates/on-break-time.constants');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateOnBreakTimeValidator = ajv.compile({
  type: 'object',
  properties: {
    action: {
      type: 'string',
      enum: OnBreakTimeEnumLists,
    },
    dateTime: { type: 'string', format: 'date-time' },
  },
  required: ['action', 'dateTime'],
  additionalProperties: false,
});

const UpdateOnBreakTimeValidator = ajv.compile({
  type: 'object',
  properties: {
    dateTime: { type: 'string' },
  },
  required: ['dateTime'],
  additionalProperties: false,
});

module.exports = { CreateOnBreakTimeValidator, UpdateOnBreakTimeValidator };
