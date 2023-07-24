const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const CreateUsersValidator = ajv.compile({
  type: 'object',
  properties: {
    username: { type: 'string', isEngTextAndAllowedCharacterOnly: true },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 50,
      isAllowedCharacterPassword: true,
    },
    email: {
      type: 'string',
      format: 'email',
      isBitkubSite: true,
    },
    level: { type: 'string', enum: ['qaAgent', 'superVisor', 'assistManager'] },
    status: { type: 'string', enum: ['active', 'deactive', 'unlock'] },
  },
  required: ['username', 'password', 'email'],
  additionalProperties: false,
});

const UpdateUsersValidator = ajv.compile({
  type: 'object',
  properties: {
    username: { type: 'string', isEngTextAndAllowedCharacterOnly: true },
    level: { type: 'string', enum: ['qaAgent', 'superVisor', 'assistManager'] },
    imageId: { type: 'string' },
    signatureId: { type: 'string' },
    status: { enum: ['active', 'deactive', 'unlock'] },
  },
  required: [],
  additionalProperties: false,
});
module.exports = { CreateUsersValidator, UpdateUsersValidator };
