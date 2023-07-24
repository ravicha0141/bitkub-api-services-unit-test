const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const resultEvaluateMailValidator = ajv.compile({
  type: 'object',
  properties: {
    sendTo: {
      type: 'string',
      format: 'email',
      isBitkubSite: true,
    },
    ccSendTo: {
      type: 'string',
      format: 'email',
      isBitkubSite: true,
    },
  },
  required: ['sendTo', 'ccSendTo'],
  additionalProperties: false,
});

module.exports = { resultEvaluateMailValidator };
