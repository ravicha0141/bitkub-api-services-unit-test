const path = require('path');
const __dir = require('app-root-path');
const ajv = require(path.resolve(`${__dir}/src/validator/validator`));

const SigninValidator = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    remember: { type: 'boolean' },
  },
  required: ['email', 'password', 'remember'],
  additionalProperties: false,
});

const GetTokenValidator = ajv.compile({
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
  },
  required: ['refreshToken'],
  additionalProperties: false,
});

module.exports = { SigninValidator, GetTokenValidator };
