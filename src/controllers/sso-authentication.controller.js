const express = require('express');
const { isEmail } = require('../utilities');
const { LoggerServices } = require('../logger');
const { ErrorSetOfAuth } = require(`../constants/error-sets`);
const appConfig = require('../../configurations');
const { getSignedUrl } = require('../services/s3.service');

const serviceName = 'sso-authen';

const SsoAuthenticationController = (options = {}) => {
  const router = express.Router();
  const { passport, userRepository, attachmentRepository, groupRepository, memberRepository, auditlogRepository } = options;

  router.get('/me', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    logger.info('get profile and session');
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        errorMessage: 'Unauthorized',
      });
    } else {
      if (!req.session.passport.user) {
        return res.status(400).json(ErrorSetOfAuth.BIQ_USR_06);
      }
      const userSessionData = req.session.passport.user;
      logger.debug('userSessionData', userSessionData);
      const userEmail = (await isEmail(userSessionData['nameID']))
        ? userSessionData['nameID']
        : userSessionData[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`];
      logger.debug('userEmail', userEmail);
      const userData = await userRepository.getOneUserByFilter({ email: userEmail.toLowerCase() });
      if (userData) {
        const { _id: userId } = userData;
        const propForCreateLog = {
          userId,
          service: serviceName,
        };
        auditlogRepository.create({ ...propForCreateLog, action: 'signin-success' });
        const accessTokenData = await userRepository.getAccessToken(userData, true);
        const imageData = await attachmentRepository.getOneByFilter({ _id: userData['imageId'], typeFile: 'profile-picture' });
        const signatureData = await attachmentRepository.getOneByFilter({ _id: userData['signatureId'], typeFile: 'signature' });
        let groupId = '';
        let groupName = '';
        let memberId = '';
        const memberData = await memberRepository.getOneWithFilter({ userId: userData._id });
        logger.debug('memberData', memberData);
        if (memberData) {
          groupId = memberData['groupId'];
          memberId = memberData['_id'];
          const groupData = await groupRepository.getGroupById(memberData['groupId']);
          if (groupData) {
            groupName = groupData['name'];
          }
        }
        let signedImageUri = '';
        let signedSignatureUri = '';

        if (imageData) signedImageUri = await getSignedUrl(imageData);
        if (signatureData) signedSignatureUri = await getSignedUrl(signatureData);
        const responseData = {
          accessToken: accessTokenData.accessToken,
          refreshToken: accessTokenData.refreshToken,
          profile: {
            ...userData,
            imageData,
            signatureData,
            groupId,
            groupName,
            memberId,
            memberData,
            signedImageUri,
            signedSignatureUri,
          },
        };
        logger.debug('responseData', responseData);
        logger.info('get-site-authen-data completed.');
        return res.status(200).json(responseData);
      } else {
        if (await isEmail(userEmail)) {
          const index = userEmail.lastIndexOf('@');
          const username = userEmail.substring(0, index);
          const dataForCreateUser = {
            username,
            email: userEmail,
            role: 'qaAgent',
            type: 'SSO_AUTHEN',
            status: 'active',
          };
          logger.debug('dataForCreateUser', dataForCreateUser);
          const profile = await userRepository.createAndCheckDup(dataForCreateUser, 'SSO_AUTHEN');
          if (!profile) {
            logger.error('error-profile-not-found', ErrorSetOfAuth.BIQ_AUT_01);
            return res.status(400).json(ErrorSetOfAuth.BIQ_AUT_01);
          }
          logger.debug('sso-create-user-success');
          const { _id: userId } = profile;
          const propForCreateLog = {
            userId,
            service: serviceName,
          };
          auditlogRepository.create({ ...propForCreateLog, action: 'signin-success-and-create-new-user' });
          const accessTokenData = await userRepository.getAccessToken(profile, true);
          const responseData = {
            accessToken: accessTokenData.accessToken || null,
            refreshToken: accessTokenData.refreshToken || null,
            profile,
          };
          logger.info('get-sso-authen-data completed.');
          return res.status(200).json(responseData);
        }
        logger.error('is-not-email', userEmail);
        logger.error('error-authen', ErrorSetOfAuth.BIQ_USR_05);
        return res.status(400).json(ErrorSetOfAuth.BIQ_USR_05);
      }
    }
  });

  router.get('/login', passport.authenticate('saml', appConfig.saml.options), (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    logger.debug('get-login-redirectUrl', appConfig.saml.redirectUrl);
    logger.info('login-on-sso-authen completed.');
    return res.redirect(appConfig.saml.redirectUrl);
  });

  router.post('/callback', passport.authenticate('saml', appConfig.saml.options), (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    logger.debug('post-callback-redirectUrl', appConfig.saml.redirectUrl);
    logger.info('sso-authen-data-on-callback completed.');
    return res.redirect(appConfig.saml.redirectUrl);
  });

  router.post('/logout', (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    res.clearCookie('connect.sid');
    if (req.session) {
      logger.debug('post-logout-session', req.session);
      req.session.destroy();
      req.logout(() => {});
      const logoutUrl = appConfig.saml.logoutUrl;
      logger.debug('post-logout-logoutUrl', logoutUrl);
      return res.status(200).json({ message: 'Logout Success', logoutUrl });
    }
    logger.info('logout-with-sso-authen completed.');
    return res.status(200).json({ message: 'Logout Success' });
  });

  return router;
};

module.exports = SsoAuthenticationController;
