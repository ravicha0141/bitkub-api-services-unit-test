const { doubleCsrf } = require('csrf-csrf');
const configurations = require('../../configurations/index.js');

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => configurations.session.secret,
  secret: configurations.csrfSession.secret,
  cookieName: 'bitqast.x-csrf-token',
  cookieOptions: configurations.session.cookie,
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

const csrfMiddleware = (request, response) => {
  const csrfToken = generateToken(response);
  return response.json({ csrfToken });
};
module.exports = { csrfMiddleware, doubleCsrfProtection };
