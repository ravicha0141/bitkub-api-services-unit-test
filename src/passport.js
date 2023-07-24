const fs = require('fs');
const passport = require('passport');
const SamlStrategy = require('@node-saml/passport-saml').Strategy;
const appConfig = require('../configurations');

passport.serializeUser((expressUser, done) => {
  done(null, expressUser);
});

passport.deserializeUser((expressUser, done) => {
  done(null, expressUser);
});

passport.use(
  new SamlStrategy(
    {
      issuer: appConfig.saml.issuer,
      protocol: 'http://',
      path: '/sso/callback',
      entryPoint: appConfig.saml.entryPoint,
      cert: fs.readFileSync(appConfig.saml.cert, 'utf-8'),
      signatureAlgorithm: 'sha1',
      acceptedClockSkewMs: -1,
      wantAssertionsSigned: false,
      wantAuthnResponseSigned: false,
    },
    (profile, done) => {
      const jsonObjProfile = JSON.parse(JSON.stringify(profile));
      return done(null, jsonObjProfile);
    },
  ),
);
