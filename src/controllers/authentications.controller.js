require('dotenv').config();
const path = require('path');
const express = require('express');
const __dir = require('app-root-path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SigninValidator, GetTokenValidator } = require('../validator/authentications.validator');
const { LoggerServices } = require('../logger');
const { ErrorSetOfAuth } = require('../constants/error-sets');
const { getSignedUrl } = require('../services/s3.service');
const configKey = require(path.resolve(`${__dir}/configurations`)).tokenKey;
const serviceName = 'authentication';

const AuthenticationController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { userRepository, attachmentRepository, memberRepository, groupRepository, auditlogRepository } = options;

  router.post('/signin', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('signin', { payload: { ...req.body } });
      const checkValidateData = SigninValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfAuth.BIQ_AUT_06, validateErrorList: SigninValidator.errors };
        logger.error('signin validate-error', { ...errorObject, debugMessage: SigninValidator.errors });
        return res.status(400).json(errorObject);
      }

      const emailLowercase = String(req.body.email).toLowerCase();
      const password = String(req.body.password);
      const remember = String(req.body.remember).toLowerCase() === 'true';
      let userData = await userRepository.getOneUserByFilterWithPassword({ email: emailLowercase });
      if (!userData) {
        logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_01);
        return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_01);
      }
      const { level, status: userStatus, _id: userId } = userData;
      const propForCreateLog = {
        userId,
        service: serviceName,
      };
      logger.debug('user data', userData);
      if (userStatus === 'deactive' && level !== 'systemAdmin') {
        auditlogRepository.create({ ...propForCreateLog, action: 'signin-with-deaction' });
        logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_02);
        return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_02);
      }
      if (userStatus == 'unlock') {
        auditlogRepository.create({ ...propForCreateLog, action: 'signin-with-unlock' });
      } else {
        const verifiedPassword = bcrypt.compareSync(password, userData['password']);
        if (!verifiedPassword) {
          const overLimitRequestSignin = await userRepository.increaseRequestSignIn(emailLowercase);
          logger.debug('over limit request signin', overLimitRequestSignin);
          if (overLimitRequestSignin['count'] === 3) {
            await userRepository.setRequestSignInDeactive(emailLowercase);
            auditlogRepository.create({ ...propForCreateLog, action: 'signin-wrong-invalid-password-for-3-times' });
            logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_05);
            return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_05);
          } else if (overLimitRequestSignin['count'] > 3) {
            auditlogRepository.create({ ...propForCreateLog, action: 'signin-wrong-and-set-user-deactive' });
            logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_02);
            return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_02);
          }
          auditlogRepository.create({ ...propForCreateLog, action: 'signin-wrong-invalid-password' });
          logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_04);
          return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_04);
        }
        auditlogRepository.create({ ...propForCreateLog, action: 'signin-successfully' });
        userData = await userRepository.updateUserByObject(userData._id, { status: 'active' });
      }
      const accessTokenData = await userRepository.getAccessToken(userData, remember);
      if (!accessTokenData) {
        logger.error('signin error', ErrorSetOfAuth.BIQ_AUT_04);
        return res.status(401).json(ErrorSetOfAuth.BIQ_AUT_04);
      }
      const imageData = await attachmentRepository.getOneByFilter({ _id: userData['imageId'], typeFile: 'profile-picture' });
      const signatureData = await attachmentRepository.getOneByFilter({ _id: userData['signatureId'], typeFile: 'signature' });

      const responseData = {
        accessToken: accessTokenData.accessToken,
        refreshToken: accessTokenData.refreshToken,
        profile: {
          ...userData,
          groupId: '',
          memberId: '',
          groupName: '',
          memberData: {},
          imageData,
          signatureData,
        },
      };
      responseData.profile.signedImageUri = imageData ? await getSignedUrl(imageData) : '';
      responseData.profile.signedSignatureUri = signatureData ? await getSignedUrl(signatureData) : '';
      const memberData = await memberRepository.getOneWithFilter({ userId: userData._id });
      logger.debug('member data', memberData);
      if (memberData) {
        responseData.profile.groupId = memberData['groupId'];
        responseData.profile.memberId = memberData['_id'];
        const groupData = await groupRepository.getGroupById(memberData['groupId']);
        if (groupData) {
          responseData.profile.groupName = groupData['name'];
        }
        logger.debug('group data', groupData);
        responseData.profile.memberData = memberData;
      }

      logger.debug('response data', responseData);
      res.status(200).json(responseData);
      logger.info('signin completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfAuth.BIQ_AUT_00 };
      logger.critical(ErrorSetOfAuth.BIQ_AUT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/token', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('gen-token', { payload: req.body });
      const checkValidateData = GetTokenValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfAuth.BIQ_AUT_07, validateErrorList: GetTokenValidator.errors };
        logger.error('gen-token validate-error', { ...errorObject, debugMessage: GetTokenValidator.errors });
        return res.status(400).json(errorObject);
      }
      const refreshToken = `${req.body.refreshToken}`;
      const authenData = await userRepository.getrefresTokenData(refreshToken);
      if (!authenData) {
        logger.error('gen-token error', ErrorSetOfAuth.BIQ_AUT_08);
        return res.status(400).json(ErrorSetOfAuth.BIQ_AUT_08);
      }
      logger.debug('authen data', authenData);
      const email = `${authenData['email']}`;
      const profile = await userRepository.getOneUserByFilter({
        email: email,
      });

      logger.debug('profile', profile);
      if (authenData['remember']) {
        const accessToken = jwt.sign(profile, configKey.accessToken.privateKey, {
          expiresIn: configKey.accessToken.accessTokenLife,
          algorithm: 'RS256',
        });
        const refreshToken = jwt.sign(profile, configKey.refreshToken.privateKey, {
          expiresIn: configKey.refreshToken.refreshTokenLife,
          algorithm: 'RS256',
        });
        await userRepository.updateTokenOfUser(email, accessToken, refreshToken, true);

        logger.debug('response data', { profile, accessToken: 'secret', refreshToken: 'secret' });
        res.status(200).json({ profile, accessToken, refreshToken });
        logger.info('gen-token completed.');
        return;
      }
      logger.error('gen-token error', ErrorSetOfAuth.BIQ_AUT_09);
      return res.status(401).json({ profile, accessToken: false, refreshToken: false });
    } catch (error) {
      const errorObject = { ...ErrorSetOfAuth.BIQ_AUT_00 };
      logger.critical(ErrorSetOfAuth.BIQ_AUT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = AuthenticationController;
