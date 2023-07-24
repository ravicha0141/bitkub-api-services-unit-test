const path = require('path');
const __dir = require('app-root-path');
const { VarianceStatusEnumArray } = require('../../constants/variances.constants');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const createVarianceData = ajv.compile({
  type: 'object',
  properties: {
    evaluateId: { type: 'string' },
  },
  required: ['evaluateId'],
  additionalProperties: false,
});

const updateVarianceData = ajv.compile({
  type: 'object',
  properties: {
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    note: { type: 'string' },
    internalNote: { type: 'string' },
    isDispute: { type: 'boolean' },
    status: {
      type: 'string',
      enum: VarianceStatusEnumArray,
    },
  },
  required: [],
  additionalProperties: false,
});

module.exports = { createVarianceData, updateVarianceData };
