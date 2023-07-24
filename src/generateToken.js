const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
}
const accessTokenKeyPair = generateKeyPair();
const refreshTokenKeyPair = generateKeyPair();
fs.writeFileSync('../configurations/keys/access-public.pem', accessTokenKeyPair.publicKey);
fs.writeFileSync('../configurations/keys/access-private.pem', accessTokenKeyPair.privateKey);
fs.writeFileSync('../configurations/keys/refresh-public.pem', refreshTokenKeyPair.publicKey);
fs.writeFileSync('../configurations/keys/refresh-private.pem', refreshTokenKeyPair.privateKey);
