const jwt = require('jsonwebtoken');
const path = require('path');
const __dir = require('app-root-path');
const configToken = require(path.resolve(`${__dir}/configurations`)).tokenKey;
const basicAuth = require(path.resolve(`${__dir}/configurations`)).authorization;
const { ErrorSetOfAuthorization } = require(`../constants/error-sets`);

const AuthorizationMiddleware = async (req, res, next) => {
  try {
    const authenType = `${req['headers']['grant-type']}`;
    const _path = req['path'];
    if (_path === '/sso/login' || _path === '/sso/callback' || _path === '/sso/logout') {
      return next();
    }
    if (authenType === `accessToken`) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, configToken.accessToken.publicKey);
        if (decoded) {
          req['user'] = JSON.parse(JSON.stringify(decoded));
          return next();
        }
        return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_01);
      }
      return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_01);
    } else if (
      (authenType === `client_credentials` && _path === '/authenticate/signin') ||
      (authenType === `refreshToken` && _path === '/authenticate/token')
    ) {
      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
      if (b64auth.length > 4) {
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        if (username && password && username === basicAuth.username && password === basicAuth.password) return next();
        return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_02);
      }
      return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_02);
    }
    return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_02);
  } catch (error) {
    const code = error.message.split(' ').join('');
    if (code === `jwtexpired`) {
      return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_04);
    }
    return res.status(401).json(ErrorSetOfAuthorization.BIQ_ATZ_02);
  }
};

module.exports = { AuthorizationMiddleware };
