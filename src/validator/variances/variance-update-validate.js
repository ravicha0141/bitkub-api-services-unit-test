const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

module.exports = ajv.compile({
  type: 'object',
  properties: {
    isDispute: { type: 'boolean' },
    status: { type: 'string' },
    netScore: { type: 'number' },
    areaOfStrength: { type: 'string' },
    areaOfImprovement: { type: 'string' },
    tags: { type: 'object' },
    internalNote: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
});
