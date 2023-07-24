const path = require('path');
const __dir = require('app-root-path');
const express = require('express');
const bcrypt = require('bcryptjs');
const { AgentQueryFilterValidator, CreateAgentValidator } = require('../validator/agents/agent.validator');
const { GetAgentQueryDTO } = require('../dto/agents.dto');
const { getOnlyInLeft } = require('../utilities');
const { createPermissionValidator, updatePermissionValidator } = require('../validator/setting/permissions.validator');
const { CreateUsersValidator, UpdateUsersValidator } = require('../validator/setting/users.validator');
const { CreateConsentsValidator, UpdateConsentsValidator } = require('../validator/setting/consents.validator');
const { CreateTimesValidator } = require('../validator/setting/times.validator');
const {
  ErrorSetOfSettingAgent,
  ErrorSetOfSettingUsers,
  ErrorSetOfPermission,
  ErrorSetOfSettingConsent,
  ErrorSetOfSettingOverview,
  ErrorSetOfSettingTime,
  ErrorSetOfSettingAccessibilities,
} = require(`../constants/error-sets`);
const { getSignedUrl } = require('../services/s3.service');
const { LoggerServices } = require('../logger');
const { updateUserDTO } = require('../dto/settings/user.dto');
const agentDto = require(path.resolve(`${__dir}/src/dto/agents.dto`));
const userDTO = require(path.resolve(`${__dir}/src/dto/settings/user.dto`));
const settingTimeDto = require(path.resolve(`${__dir}/src/dto/settings/time.dto`));
const serviceName = 'setting';
const SettingController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    userRepository,
    groupRepository,
    overviewRepository,
    timeSettingRepository,
    attachmentRepository,
    agentRepository,
    memberRepository,
    accessibilitieRepository,
    permissionRepository,
    consentRepository,
  } = options;

  router.get('/users', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-user', { query: req.query });
      const userFilter = userDTO.getUserListQueryDTO(req.query);
      const onlyGroupIsNull = req.query.groupIsNull === 'true' ? true : false;
      logger.debug('query for get list user', userFilter);

      const listUsers = await userRepository.getAllUsers(userFilter);
      const mapMembers = await memberRepository
        .getMemberAndGroupInfo({ userId: { $in: listUsers.map((user) => user['_id']) } })
        .then((membersData) => membersData.reduce((acc, cur) => acc.set(String(cur.userId), cur), new Map()));
      logger.debug('member info list', { membersData: mapMembers.size });

      const arrayListUsers = [];
      for (let index = 0; index < listUsers.length; index++) {
        const user = { ...listUsers[index] };
        const memberInfo = mapMembers.get(String(user['_id'])) || {};
        if (onlyGroupIsNull && memberInfo['groupInfo']) continue;
        if ('groupId' in req.query && memberInfo['groupId'] !== req.query['groupId']) continue;

        user['groupId'] = memberInfo['groupId'] || null;
        user['groupName'] = memberInfo['groupInfo']?.name || null;
        user['memberId'] = memberInfo['_id'] || null;
        arrayListUsers.push(user);
      }

      const imageIds = arrayListUsers.filter((user) => user['imageId']).map((user) => user['imageId']);
      const mapImageUrl = await attachmentRepository
        .getAllWithSignedUrl({ _id: { $in: imageIds }, typeFile: 'profile-picture' })
        .then((signedUrlList) => signedUrlList.reduce((acc, cur) => acc.set(cur._id, cur.signedUrl), new Map()));
      arrayListUsers.every((user) => {
        user['signedImageUri'] = user['imageId'] ? mapImageUrl.get(user['imageId']) : null;
        return true;
      });
      logger.debug('response data', { length: arrayListUsers.length, sample: arrayListUsers.slice(0, 2) });
      logger.info('get-list-of-users completed.');
      return res.status(200).json(arrayListUsers);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/users', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-user', { payload: req.body });
      const checkValidateData = CreateUsersValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_02, validateErrorList: CreateUsersValidator.errors };
        logger.error('create-user validate-error', { ...errorObject, debugMessage: CreateUsersValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { email, username } = req.body;
      const checkDup = await userRepository.checkDupEmailAndUssername(email, username);
      if (checkDup) {
        logger.error('create-user error', ErrorSetOfSettingUsers.BIQ_USR_03);
        return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_03);
      }
      const _password = req.body.password;
      const hashPassword = bcrypt.hashSync(_password, bcrypt.genSaltSync(8), null);
      const password = hashPassword;
      const userCreated = await userRepository.create({ ...req.body, password, type: 'SITE_AUTHEN' });
      if (!userCreated) {
        logger.error('create-user error', ErrorSetOfSettingUsers.BIQ_USR_08);
        return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_08);
      }
      logger.debug('user created', userCreated);
      logger.info('create-user completed.');
      return res.status(200).json(userCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/users/:userId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-user', { params: req.params });
      const { userId } = req.params;
      const userProfileData = await userRepository.getOneUserByFilter({ _id: userId });
      if (!userProfileData) {
        logger.error('get-user error', ErrorSetOfSettingUsers.BIQ_USR_01);
        return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_01);
      }
      const imageData = await attachmentRepository.getOneByFilter({ _id: userProfileData['imageId'], typeFile: 'profile-picture' });
      logger.debug('image data of user', imageData);
      const signatureData = await attachmentRepository.getOneByFilter({ _id: userProfileData['signatureId'], typeFile: 'signature' });
      logger.debug('signature data of user', signatureData);
      const memberData = await memberRepository.getOneWithFilter({ userId });
      logger.debug('member data of user', memberData);
      const returnData = { ...userProfileData, imageData, signatureData };
      if (memberData) {
        const memberData = await memberRepository.getOneWithFilter({ userId });
        const groupData = await groupRepository.getGroupById(memberData['groupId']);
        returnData['groupId'] = memberData['groupId'];
        returnData['memberId'] = memberData['_id'];
        if (groupData) returnData['groupName'] = groupData['name'];
      }
      returnData['signedImageUri'] = imageData ? await getSignedUrl(imageData) : null;
      returnData['signedSignatureUri'] = signatureData ? await getSignedUrl(signatureData) : null;
      logger.debug('user data', returnData);
      logger.info('get-user completed.');
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/users/:userId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-user', { params: req.params, payload: req.body });
      const checkValidateData = UpdateUsersValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_04, validateErrorList: UpdateUsersValidator.errors };
        logger.error('update-user validate-error', { ...errorObject, debugMessage: UpdateUsersValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { userId } = req.params;
      const userProfileData = await userRepository.getOneUserByFilter({ _id: userId });
      if (!userProfileData) {
        logger.error('update-user error', ErrorSetOfSettingUsers.BIQ_USR_01);
        return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_01);
      }
      const { username } = userProfileData;
      const { username: newUsername } = req.body;
      if (username !== newUsername) {
        const checkDuplicateUsername = await userRepository.getOneUserByFilter({ username: newUsername });
        if (checkDuplicateUsername) {
          logger.error('update-user error', ErrorSetOfSettingUsers.BIQ_USR_03);
          return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_03);
        }
      }
      logger.debug('user data', userProfileData);
      const userDataUpdated = await userRepository.updateUserByObject(userId, updateUserDTO(req.body));
      logger.debug('user profile data updated', userDataUpdated);
      logger.info('update-user completed.');
      return res.status(200).json(userDataUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/users/:userId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-user', { params: req.params });
      const { userId } = req.params;
      const userProfileData = await userRepository.getOneUserByFilter({ _id: userId });
      if (!userProfileData) {
        logger.error('delete-user error', ErrorSetOfSettingUsers.BIQ_USR_01);
        return res.status(400).json(ErrorSetOfSettingUsers.BIQ_USR_01);
      }
      const { email } = userProfileData;
      logger.debug('user profile data', userProfileData);
      const userRemoved = await userRepository.deleteUser(userId);
      logger.debug('user profile removed', userRemoved);
      const requestSignInCleared = await userRepository.clearRequestSignIn(email);
      logger.debug('clear sign in request', requestSignInCleared);
      const memberDeleted = await memberRepository.deleteOne({ userId });
      logger.debug('member data removed', memberDeleted);
      logger.info('delete-user completed.');
      return res.status(200).json({ userRemoved, memberDeleted });
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingUsers.BIQ_USR_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/overview', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-overview');
      const overviewData = await overviewRepository.getOverviewData();
      logger.debug('overview data', overviewData);
      logger.info('get-overview completed.');
      return res.status(200).json(overviewData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingOverview.BIQ_OVW_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/overview', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-overview', { payload: req.body });
      const overviewData = await overviewRepository.getOverviewData();
      if (!overviewData) {
        logger.error('update-overview error', ErrorSetOfSettingOverview.BIQ_OVW_01);
        return res.status(400).json(ErrorSetOfSettingOverview.BIQ_OVW_01);
      }
      logger.debug('overview data', overviewData);
      const overviewupdated = await overviewRepository.update(overviewData['_id'], req.body);
      if (!overviewupdated) {
        logger.error('update-overview error', ErrorSetOfSettingOverview.BIQ_OVW_02);
        return res.status(400).json(ErrorSetOfSettingOverview.BIQ_OVW_02);
      }
      logger.debug('overview updated', overviewupdated);
      logger.info('update-overview completed.');
      return res.status(200).json(overviewupdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingOverview.BIQ_OVW_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/times', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-time-setting', { query: req.query });
      const listOfTimeSettings = await timeSettingRepository.getListByFilter(req.query);

      logger.debug('response data', { length: listOfTimeSettings.length, sample: listOfTimeSettings.slice(0, 2) });
      logger.info('get-list-of-time-setting completed.');
      return res.status(200).json(listOfTimeSettings);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/times/:timeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-time-setting', { params: req.params, query: req.query });
      const { timeId } = req.params;
      const settingTimeData = await timeSettingRepository.getOneByFilter({ ...req.query, _id: timeId });
      if (!settingTimeData) {
        logger.error('get-time-setting error', ErrorSetOfSettingTime.BIQ_STT_01);
        return res.status(400).json(ErrorSetOfSettingTime.BIQ_STT_01);
      }
      logger.debug('time setting data', settingTimeData);
      logger.info('get-time-setting completed.');
      return res.status(200).json(settingTimeData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/times', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-time-setting', { payload: req.body });
      const checkValidateData = CreateTimesValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_03, validateErrorList: CreateTimesValidator.errors };
        logger.error('create-time-setting validate-error', { ...errorObject, debugMessage: CreateTimesValidator.errors });
        return res.status(400).json(errorObject);
      }
      const dataForCreate = settingTimeDto.createSettingTimeDTO(req.body);
      logger.debug('data for create time setting', dataForCreate);
      const timeSettingCreated = await timeSettingRepository.create(dataForCreate);
      if (!timeSettingCreated) {
        logger.error('create-time-setting error', ErrorSetOfSettingTime.BIQ_STT_05);
        return res.status(400).json(ErrorSetOfSettingTime.BIQ_STT_05);
      }
      logger.debug('time setting created', timeSettingCreated);
      logger.info('create-time-setting completed.');
      return res.status(200).json(timeSettingCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/times/:timeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-time-setting', { params: req.params, payload: req.body });
      const { timeId } = req.params;
      const settingTimeData = await timeSettingRepository.getOneByFilter({ _id: timeId });
      if (!settingTimeData) {
        logger.error('update-time-setting error', ErrorSetOfSettingTime.BIQ_STT_01);
        return res.status(400).json(ErrorSetOfSettingTime.BIQ_STT_01);
      }
      const dataForUpdate = settingTimeDto.updateSettingTimeDTO(req.body);
      logger.debug('data for update time setting', dataForUpdate);
      const settingTimeUpdated = await timeSettingRepository.update(timeId, dataForUpdate);
      if (!settingTimeUpdated) {
        logger.error('update-time-setting error', ErrorSetOfSettingTime.BIQ_STT_02);
        return res.status(400).json(ErrorSetOfSettingTime.BIQ_STT_02);
      }
      logger.debug('time setting updated', settingTimeUpdated);
      logger.info('update-time-setting completed.');
      return res.status(200).json(settingTimeUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/times/:timeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-time-setting', { params: req.params });
      const { timeId } = req.params;
      const settingTimeData = await timeSettingRepository.getOneByFilter({ _id: timeId });
      if (!settingTimeData) {
        logger.error('delete-time-setting error', ErrorSetOfSettingTime.BIQ_STT_01);
        return res.status(400).json(ErrorSetOfSettingTime.BIQ_STT_01);
      }
      logger.debug('time setting', settingTimeData);
      const settingTimeRemoved = await timeSettingRepository.deleteOne(timeId);
      logger.debug('time setting removed', settingTimeRemoved);
      logger.info('delete-time-setting completed.');
      return res.status(200).json(settingTimeRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/accessibilities', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const listOfAccessibilities = await accessibilitieRepository.getListByFilter(req.query);
      logger.info('get-list-of-accessibilities completed.');
      return res.status(200).json(listOfAccessibilities);
    } catch (error) {
      logger.critical(ErrorSetOfSettingAccessibilities.BIQ_ACS_00.errorMessage, error?.message);
      return res.status(500).json({ ...ErrorSetOfSettingAccessibilities.BIQ_ACS_00, debugMessage: error?.message });
    }
  });

  router.post('/accessibilities', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-accessibility', { payload: req.body });
      const { groupId, permissionId } = req.body;
      const groupData = await groupRepository.getGroupById(groupId);
      if (!groupData) {
        logger.error('create-accessibility error', ErrorSetOfSettingAccessibilities.BIQ_ACS_01);
        return res.status(400).json(ErrorSetOfSettingAccessibilities.BIQ_ACS_01);
      }
      logger.debug('group data', groupData);
      const permissionData = await permissionRepository.getOneByFilter({ _id: permissionId });
      if (!permissionData) {
        logger.error('create-accessibility error', ErrorSetOfSettingAccessibilities.BIQ_ACS_02);
        return res.status(400).json(ErrorSetOfSettingAccessibilities.BIQ_ACS_02);
      }
      logger.debug('permission data', permissionData);
      const accessibilitieData = await accessibilitieRepository.getOneByFilter({ groupId, permissionId });
      if (accessibilitieData) {
        logger.error('create-accessibility error', ErrorSetOfSettingAccessibilities.BIQ_ACS_03);
        return res.status(400).json(ErrorSetOfSettingAccessibilities.BIQ_ACS_03);
      }
      const dataForCreate = { groupId, permissionId, permissionName: permissionData['name'], permissionKey: permissionData['key'] };
      logger.debug('data for create accessibilitie data', dataForCreate);
      const dataCreated = await accessibilitieRepository.create(dataForCreate);
      logger.debug('accessibilitie data created', dataCreated);
      logger.info('create-accessibility completed.');
      return res.status(200).json(dataCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingTime.BIQ_STT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/permissions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-permissions', { query: req.query });
      const listOfAccessibilities = await permissionRepository.getListByFilter(req.query);

      logger.debug('response data', { length: listOfAccessibilities.length, sample: listOfAccessibilities.slice(0, 2) });
      logger.info('get-list-of-permissions completed.');
      return res.status(200).json(listOfAccessibilities);
    } catch (error) {
      const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/permissions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-permission', { payload: req.body });
      const validated = createPermissionValidator(req.body);
      if (!validated) {
        const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_01, validateErrorList: createPermissionValidator.errors };
        logger.error('create-permission validate-error', { ...errorObject, debugMessage: createPermissionValidator.errors });
        return res.status(400).json(errorObject);
      }
      const permissionCreated = await permissionRepository.create(req.body);
      logger.debug('permission created', permissionCreated);
      logger.info('create-permission completed.');
      return res.status(200).json(permissionCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/permissions/:permissionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-permission', { params: req.params, payload: req.body });
      const validated = updatePermissionValidator(req.body);
      if (!validated) {
        const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_01, validateErrorList: updatePermissionValidator.errors };
        logger.error('update-permission validate-error', { ...errorObject, debugMessage: updatePermissionValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { permissionId } = req.params;
      const permissionData = await permissionRepository.getOneByFilter({ _id: permissionId });
      if (!permissionData) {
        logger.error('update-permission error', ErrorSetOfPermission.BIQ_PMS_03);
        return res.status(400).json(ErrorSetOfPermission.BIQ_PMS_03);
      }
      logger.debug('permission data', permissionData);
      const permissionUpdated = await permissionRepository.update(permissionId, req.body);
      logger.debug('permission updated', permissionUpdated);
      logger.info('update-permission completed.');
      return res.status(200).json(permissionUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/permissions/:permissionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-permission', { params: req.params });
      const { permissionId } = req.params;
      const permissionData = await permissionRepository.getOneByFilter({ _id: permissionId });
      if (!permissionData) {
        logger.error('delete-permission error', ErrorSetOfPermission.BIQ_PMS_03);
        return res.status(400).json(ErrorSetOfPermission.BIQ_PMS_03);
      }
      logger.debug('permission data', permissionData);
      const permissionRemoved = await permissionRepository.deleteOne(permissionId);
      logger.debug('permission removed', permissionRemoved);
      logger.info('delete-permission completed.');
      return res.status(200).json(permissionRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfPermission.BIQ_PMS_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/agents', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-agents', { query: req.query });
      const validated = AgentQueryFilterValidator(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_05, validateErrorList: AgentQueryFilterValidator.errors };
        logger.error('get-list-of-agents validate-error', { ...errorObject, debugMessage: AgentQueryFilterValidator.errors });
        return res.status(400).json(errorObject);
      }
      const agentsList = await agentRepository.getAll(GetAgentQueryDTO(req.query));
      const { groupIsNull } = req.query;
      if (groupIsNull) {
        const listAllMembers = await memberRepository.getListWithFilter({ role: 'agent' });
        const memberWithoutGroups = await getOnlyInLeft(agentsList, listAllMembers);
        logger.info('get-list-of-agents completed.');
        return res.status(200).json(memberWithoutGroups);
      }

      logger.debug('response data', { length: agentsList.length, sample: agentsList.slice(0, 2) });
      logger.info('get-list-of-agents completed.');
      return res.status(200).json(agentsList);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/agents/:agentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-agent', { params: req.params });
      const { agentId } = req.params;
      const agentData = await agentRepository.getOneByFilter({ _id: agentId });
      if (!agentData) {
        logger.error('get-agent error', ErrorSetOfSettingAgent.BIQ_AGT_01);
        return res.status(400).json(ErrorSetOfSettingAgent.BIQ_AGT_01);
      }
      logger.debug('agent data', agentData);
      logger.info('get-agent completed.');
      return res.status(200).json(agentData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/agents', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-agent', { payload: req.body });
      const checkValidateData = CreateAgentValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_02, validateErrorList: CreateAgentValidator.errors };
        logger.error('create-agent validate-error', { ...errorObject, debugMessage: CreateAgentValidator.errors });
        return res.status(400).json(errorObject);
      }
      const filterAgent = {
        email: req.body.email,
        username: req.body.username,
        agentId: req.body.agentId,
      };
      const agentsDate = await agentRepository.getOneByFilter(filterAgent);
      if (agentsDate !== null) {
        logger.error('create-agent error', ErrorSetOfSettingAgent.BIQ_AGT_03);
        return res.status(400).json(ErrorSetOfSettingAgent.BIQ_AGT_03);
      }
      const dataForCreate = await agentDto.createAgentDTO(req.body);
      logger.debug('data for create agent', dataForCreate);
      const agentsCreated = await agentRepository.create(dataForCreate);
      logger.debug('agent created', agentsCreated);
      logger.info('create-agent completed.');
      return res.status(200).json(agentsCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/agents/:agentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-agent', { params: req.params });
      const { agentId } = req.params;
      const agentRemoved = await agentRepository.deleteOne(agentId);
      if (!agentRemoved) {
        logger.error('delete-agent error', ErrorSetOfSettingAgent.BIQ_AGT_01);
        return res.status(400).json(ErrorSetOfSettingAgent.BIQ_AGT_01);
      }
      logger.debug('agent removed', agentRemoved);
      logger.info('delete-agent completed.');
      return res.status(200).json(agentRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingAgent.BIQ_AGT_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/consents', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-consents', { query: req.query });
      const listConsents = await consentRepository.getListByFilter(req.query);

      logger.debug('response data', { length: listConsents.length, sample: listConsents.slice(0, 2) });
      logger.info('get-list-of-consents completed.');
      return res.status(200).json(listConsents);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingConsent.BIQ_CST_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/consents', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-consent', { payload: req.body });
      const checkValidateData = CreateConsentsValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingConsent.BIQ_CST_01, validateErrorList: CreateConsentsValidator.errors };
        logger.error('create-consent validate-error', { ...errorObject, debugMessage: CreateConsentsValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { groupId } = req.body;
      const groupData = await groupRepository.getGroupById(groupId);
      if (!groupData) {
        logger.error('create-consent error', ErrorSetOfSettingConsent.BIQ_CST_04);
        return res.status(400).json(ErrorSetOfSettingConsent.BIQ_CST_04);
      }
      logger.debug('group data', groupData);
      const arrReqChanges = [];
      for (const reqChange of req.body['changeListts']) {
        arrReqChanges.push({
          _id: reqChange['_id'],
          permissionKey: reqChange['permissionKey'],
          actived: reqChange['actived'],
        });
      }
      const strReqChange = JSON.stringify(arrReqChanges);
      const listConsents = await consentRepository.getListByFilter({ groupId });

      for (const consent of listConsents) {
        if (consent['status'] === 'pending') {
          const tempArrChange = [];
          for (const change of consent['changeListts']) {
            tempArrChange.push({
              _id: change['_id'],
              permissionKey: change['permissionKey'],
              actived: change['actived'],
            });
            const strOldChange = JSON.stringify(tempArrChange);
            if (strOldChange === strReqChange) {
              logger.error(ErrorSetOfSettingConsent.BIQ_CST_05.errorMessage, ErrorSetOfSettingConsent.BIQ_CST_05);
              return res.status(400).json(ErrorSetOfSettingConsent.BIQ_CST_05);
            }
          }
        }
      }
      const consentCreated = await consentRepository.create(req.body);
      logger.debug('consent created', consentCreated);
      logger.info('create-consent completed.');
      return res.status(200).json(consentCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingConsent.BIQ_CST_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/consents/:consentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-consent', { params: req.params, payload: req.body });
      const checkValidateData = UpdateConsentsValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfSettingConsent.BIQ_CST_03, validateErrorList: UpdateConsentsValidator.errors };
        logger.error('update-consent validate-error', { ...errorObject, debugMessage: UpdateConsentsValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { consentId } = req.params;
      const consentData = await consentRepository.getOneByFilter({ _id: consentId });
      if (!consentData) {
        logger.error('update-consent error', ErrorSetOfSettingConsent.BIQ_CST_03);
        return res.status(400).json(ErrorSetOfSettingConsent.BIQ_CST_03);
      }
      logger.debug('consent data', consentData);
      const { groupId } = consentData;
      const arrayUpdateds = [];
      if (req.body['status'] === 'approved') {
        for (const accessibilitie of consentData['changeListts']) {
          const accessId = accessibilitie['_id'];
          const accessibilitieData = await accessibilitieRepository.getOneByFilter({ groupId, _id: accessId });
          if (accessibilitieData) {
            const accessibilitieUpdated = await accessibilitieRepository.update(accessId, { actived: accessibilitie['actived'] });
            arrayUpdateds.push(accessibilitieUpdated);
          }
        }
      }
      const consentUpdated = await consentRepository.update(consentId, { status: req.body['status'], achieved: true });
      logger.debug('consent updated', consentUpdated);
      logger.info('update-consent completed.');
      return res.status(200).json({ consentUpdated, arrayUpdateds });
    } catch (error) {
      const errorObject = { ...ErrorSetOfSettingConsent.BIQ_CST_00 };
      logger.critical(errorObject.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = SettingController;
