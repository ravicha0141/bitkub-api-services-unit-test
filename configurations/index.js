const path = require('path');
const __dir = require('app-root-path');
const tokenKey = require(path.resolve(`${__dir}/configurations/key.config`));
const ssoAuthenSite = require(path.resolve(`${__dir}/configurations/sso-authen.config`));

const isProduction = process.env.NODE_ENV === 'production' || false;

const appConfig = {
  tokenKey,
  authorization: {
    username: process.env.BASIC_AUTH_USERNAME,
    password: process.env.BASIC_AUTH_PASSWORD,
  },
  ssoAvaliable: false,
  saml: { ...ssoAuthenSite },
  session: {
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      secure: isProduction ? true : false,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'strict',
      signed: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
  csrfSession: {
    secret: process.env.CSRF_SECRET,
    cookie: {
      secure: isProduction ? true : false,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'strict',
      signed: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
  emailSender: process.env.EMAIL_SENDER,
  allowedOrigins: process.env.CORS_ALLOW_LISTS || '',
};

module.exports = appConfig;
