const path = require('path');
const __dir = require('app-root-path');

module.exports = {
  cert: `${path.resolve(`${__dir}/configurations/keys/sso-authen.cert`)}`,
  redirectUrl: process.env.SSO_REDIRECT_URL,
  callbackUrl: process.env.SSO_CALLBACK_URL,
  entryPoint: process.env.SSO_ENTRYPOINT_URL,
  logoutUrl: process.env.SSO_LOGOUT_URL,
  issuer: process.env.SSO_ISSUER,
  options: {
    failureRedirect: '/login/callback',
    failureFlash: true,
  },
};
