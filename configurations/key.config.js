// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
const __dir = require('app-root-path');

const accessTokenPrivateKeyFileName = process.env.ACCESS_TOKEN_PRIVATE_FILE_NAME || 'access-private.pem';
const accessTokenPublicKeyFileName = process.env.ACCESS_TOKEN_PUBLIC_FILE_NAME || 'access-public.pem';
const refreshTokenPrivateKeyFileName = process.env.REFRESH_TOKEN_PRIVATE_FILE_NAME || 'refresh-private.pem';
const refreshTokenPublicKeyFileName = process.env.REFRESH_TOKEN_PUBLIC_FILE_NAME || 'refresh-public.pem';

const accessTokenPrivateKey = fs.readFileSync(path.resolve(`${__dir}/configurations/keys/${accessTokenPrivateKeyFileName}`), 'utf8');
const accessTokenPublicKey = fs.readFileSync(path.resolve(`${__dir}/configurations/keys/${accessTokenPublicKeyFileName}`), 'utf8');
const refreshTokenPrivateKey = fs.readFileSync(path.resolve(`${__dir}/configurations/keys/${refreshTokenPrivateKeyFileName}`), 'utf8');
const refreshTokenPublicKey = fs.readFileSync(path.resolve(`${__dir}/configurations/keys/${refreshTokenPublicKeyFileName}`), 'utf8');

const keyConfig = {
  accessToken: {
    privateKey: accessTokenPrivateKey,
    publicKey: accessTokenPublicKey,
    accessTokenLife: 86400,
  },
  refreshToken: {
    privateKey: refreshTokenPrivateKey,
    publicKey: refreshTokenPublicKey,
    refreshTokenLife: 604800,
  },
};
module.exports = keyConfig;
