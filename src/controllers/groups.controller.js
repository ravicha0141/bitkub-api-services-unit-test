const path = require('path');
const __dir = require('app-root-path');
const express = require('express');
const { CreateGroupsValidator, UpdateGroupsValidator } = require('../validator/setting/groups.validator');
const { CreateGradeValidator, UpdateGradeValidator } = require('../validator/setting/grades.validator');
const { CreateMemberValidator } = require('../validator/members.validator');
const memberDto = require(path.resolve(`${__dir}/src/dto/members.dto`));
const groupDto = require(path.resolve(`${__dir}/src/dto/groups.dto`));
const gradeDto = require(path.resolve(`${__dir}/src/dto/grades.dto`));
const { ErrorSetOfGroup } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const { UserRoleEnum } = require('../constants/settings.constants');

const serviceName = 'groups';

const GroupsController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    userRepository,
    agentRepository,
    groupRepository,
    memberRepository,
    accessibilitieRepository,
    permissionRepository,
    progressionRepository,
    gradesRepository,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-group', { query: req.query });
      const arrGroupData = [];
      const getListGroups = await groupRepository.getGroupsWithFilter(req.query);
      logger.debug('group list', { length: getListGroups.length, sample: getListGroups.slice(0, 2) });

      for (let group of getListGroups) {
        const { _id: groupId } = group;
        const [amountQaAgent, amountAgent] = await Promise.all([
          memberRepository.countMemberWithFilter({ groupId, role: 'qaAgent' }),
          memberRepository.countMemberWithFilter({ groupId, role: 'agent' }),
        ]);
        group['amountQaAgent'] = amountQaAgent;
        group['amountAgent'] = amountAgent;
        arrGroupData.push(group);
      }
      logger.debug('response data', { length: arrGroupData.length, sample: arrGroupData.slice(0, 2) });
      logger.info(`get-list-group completed.`);
      return res.status(200).json(arrGroupData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-group', { payload: req.body });
      const checkValidateData = CreateGroupsValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_03, validateErrorList: CreateGroupsValidator.errors };
        logger.error('create-group validate-error', { ...errorObject, debugMessage: CreateGroupsValidator.errors });
        return res.status(400).json(errorObject);
      }
      const dataForCreate = groupDto.createGroupDTO(req.body);
      if (await groupRepository.checkGroupExist(dataForCreate)) {
        logger.error('create-group error', ErrorSetOfGroup.BIQ_GRP_01);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_01);
      }

      logger.debug('data for create group', dataForCreate);
      const groupCreated = await groupRepository.create(dataForCreate);
      if (!groupCreated) {
        logger.error('create-group error', ErrorSetOfGroup.BIQ_GRP_02);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_02);
      }
      logger.debug('group created', groupCreated);

      const groupId = groupCreated['_id'];
      const listAllPermission = await permissionRepository.getListByFilter({});
      const permissionGroups = await accessibilitieRepository.createMany(
        listAllPermission.map(({ _id, name, key }) => {
          return {
            groupId,
            permissionId: _id,
            permissionName: name,
            permissionKey: key,
          };
        }),
      );

      logger.debug('permission created', { length: permissionGroups.length, sample: permissionGroups.slice(0, 2) });
      logger.info(`create-group completed.`);
      return res.status(200).json({ ...groupCreated, permissionGroups });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:groupId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-group', { params: req.params });
      const { groupId } = req.params;
      const groupData = await groupRepository.getGroupById(groupId);
      if (!groupData) {
        logger.error('get-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }
      logger.debug('group data', groupData);
      const [agentList, qaAgentList, superVisorList, assistManagerList] = await Promise.all([
        memberRepository.getListWithFilter({ groupId, role: 'agent' }),
        memberRepository.getListWithFilter({ groupId, role: 'qaAgent' }),
        memberRepository.getListWithFilter({ groupId, role: 'superVisor' }),
        memberRepository.getListWithFilter({ groupId, role: 'assistManager' }),
      ]);

      logger.debug('group member', {
        agent: { length: agentList.length, sample: agentList.slice(0, 1) },
        qaAgent: { length: qaAgentList.length, sample: qaAgentList.slice(0, 1) },
        superVisor: { length: superVisorList.length, sample: superVisorList.slice(0, 1) },
        assistManager: { length: assistManagerList.length, sample: assistManagerList.slice(0, 1) },
      });
      logger.info(`get-group completed.`);
      return res.status(200).json({ ...groupData, agentList, qaAgentList, superVisorList, assistManagerList });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:groupId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-group', { params: req.params, payload: req.body });
      const { groupId } = req.params;
      const checkValidateData = UpdateGroupsValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_04, validateErrorList: UpdateGroupsValidator.errors };
        logger.error('update-group validate-error', { ...errorObject, debugMessage: UpdateGroupsValidator.errors });
        return res.status(400).json(errorObject);
      }
      const groupData = await groupRepository.getGroupById(groupId);
      if (!groupData) {
        logger.error('update-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      const dataForUpdate = groupDto.updateGroupDTO(req.body);
      logger.debug('data for update group', dataForUpdate);

      if (req.body.name !== groupData['name'] && (await groupRepository.checkGroupExist(dataForUpdate))) {
        logger.error('update-group error', ErrorSetOfGroup.BIQ_GRP_01);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_01);
      }

      const groupUpdated = await groupRepository.updateGroupByObj(groupId, dataForUpdate);
      if (!groupUpdated) {
        logger.error('update-group error', ErrorSetOfGroup.BIQ_GRP_04);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_04);
      }

      logger.debug('response data', groupUpdated);
      logger.info(`update-group completed.`);
      return res.status(200).json(groupUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:groupId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-group', { params: req.params });
      const { groupId } = req.params;
      const groupRemoved = await groupRepository.deleteGroup(groupId);
      if (!groupRemoved) {
        logger.error('delete-group error', ErrorSetOfGroup.BIQ_GRP_06);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_06);
      }
      logger.debug('group removed', groupRemoved);

      const memberLists = await memberRepository.getListWithFilter({ groupId });
      let arrayRemovedMember = [];
      let arrayRemovedProgressions = [];
      for (const member of memberLists) {
        const memberRemoved = await memberRepository.deleteOne({ _id: member['_id'] });
        if (memberRemoved) {
          arrayRemovedMember.push(member);
        }
        if (member['role'] === 'qaAgent') {
          const progressionRemoved = await progressionRepository.deleteMany({ groupId, qaAgentId: member['userId'] });
          arrayRemovedProgressions.push(progressionRemoved);
        }
      }
      logger.debug('array removed', {
        removedMemberCount: arrayRemovedMember.length,
        removedProgressionsCount: arrayRemovedProgressions.length,
      });

      logger.info(`delete-group completed.`);
      return res.status(200).json({ groupRemoved, arrayRemovedMember, arrayRemovedProgressions });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:groupId/members', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-members-in-group', { params: req.params, query: req.query });
      const { groupId } = req.params;
      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('get-list-members-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }
      const memberLists = await memberRepository.getListWithFilter({ ...req.query, groupId });
      logger.debug('response data', { length: memberLists.length, sample: memberLists.slice(0, 2) });
      logger.info(`get-list-members-in-group completed.`);
      return res.status(200).json(memberLists);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:groupId/members', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-member-in-group', { params: req.params, payload: req.body });
      const { groupId } = req.params;
      const groupData = await groupRepository.getOneByFilter({ _id: groupId });
      if (!groupData) {
        logger.error('create-member-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }
      const checkValidateData = CreateMemberValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_08, validateErrorList: CreateMemberValidator.errors };
        logger.error('create-member-in-group validate-error', { ...errorObject, debugMessage: CreateMemberValidator.errors });
        return res.status(400).json(errorObject);
      }
      const dataForCreate = memberDto.createMemberDTO(req.body);
      logger.debug('data for create member', dataForCreate);

      const checkUserData =
        dataForCreate.role === UserRoleEnum.AGENT
          ? await agentRepository.checkAgentExist({ _id: dataForCreate.userId })
          : await userRepository.checkUserExist({ _id: dataForCreate.userId });

      if (!checkUserData) {
        logger.error('create-member-in-group error', ErrorSetOfGroup.BIQ_GRP_09);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_09);
      }
      const filterForCheckMember = {
        groupId,
        userId: dataForCreate.userId,
      };
      if (await memberRepository.checkMemberExist(filterForCheckMember)) {
        logger.error('create-member-in-group error', ErrorSetOfGroup.BIQ_GRP_10);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_10);
      }
      const memberCreated = await memberRepository.create({ ...dataForCreate, groupId });
      if (!memberCreated) {
        logger.error('create-member-in-group error', ErrorSetOfGroup.BIQ_GRP_09);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_09);
      }
      const { role, userId: qaAgentId } = dataForCreate;
      if (role === UserRoleEnum.QA_AGENT && qaAgentId) {
        progressionRepository.updateManyWithFilter({ qaAgentId }, { groupId, groupName: groupData?.name });
      }
      logger.debug('member created', memberCreated);
      logger.info(`create-member-in-group completed.`);
      return res.status(200).json(memberCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:groupId/members/:memberId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-member-in-group', { params: req.params });
      const { groupId, memberId } = req.params;

      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('delete-member-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      if (!(await memberRepository.checkMemberExist({ _id: memberId }))) {
        logger.error('delete-member-in-group error', ErrorSetOfGroup.BIQ_GRP_12);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_12);
      }

      const memberRemoved = await memberRepository.deleteOne({ _id: memberId });
      if (!memberRemoved) {
        logger.error('delete-member-in-group error', ErrorSetOfGroup.BIQ_GRP_11);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_11);
      }

      logger.debug('member removed', memberRemoved);
      logger.info(`delete-member-in-group completed.`);
      return res.status(200).json({ removed: memberRemoved });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:groupId/accessibilities', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-accessibility-in-group', { params: req.params });
      const { groupId } = req.params;
      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('get-list-accessibility-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      const listOfAccessibility = await accessibilitieRepository.getListByFilter({ groupId });

      logger.debug('response data', { length: listOfAccessibility.length, sample: listOfAccessibility.slice(0, 2) });
      logger.info(`get-list-accessibility-in-group completed.`);
      return res.status(200).json(listOfAccessibility);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:groupId/grade-settings', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-grade-in-group', { params: req.params });
      const { groupId } = req.params;

      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('get-list-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      //const gradeOfGroup = await gradesRepository.getListWithFilter({ groupId });
      const gradeOfGroup = await gradesRepository.getListWithFilter({ _id: groupId });

      logger.debug('response data', gradeOfGroup);
      logger.info(`get-list-grade-in-group completed.`);
      return res.status(200).json(gradeOfGroup);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:groupId/grade-settings/:gradeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-grade-in-group', { params: req.params });
      const { groupId, gradeId: _id } = req.params;
      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('get-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }
      const gradeData = await gradesRepository.getOneWithFilter({ _id, groupId });
      if (!gradeData) {
        logger.error('get-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_13);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_13);
      }

      logger.debug('response data', gradeData);
      logger.info(`get-grade-in-group completed.`);
      return res.status(200).json(gradeData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:groupId/grade-settings', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-grade-in-group', { params: req.params, payload: req.body });
      const { groupId } = req.params;
      const checkValidateData = CreateGradeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_15, validateErrorList: CreateMemberValidator.errors };
        logger.error('create-grade-in-group validate-error', { ...errorObject, debugMessage: CreateMemberValidator.errors });
        return res.status(400).json(errorObject);
      }

      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('create-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      if (await gradesRepository.isExist({ groupId })) {
        logger.error('create-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_14);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_14);
      }

      const dataForCreate = gradeDto.createGradeDTO(groupId, req.body);
      logger.debug('data for create', dataForCreate);

      const gradeCreated = await gradesRepository.create(dataForCreate);

      logger.debug('response data', gradeCreated);
      logger.info(`create-grade-in-group completed.`);
      return res.status(200).json({ gradeCreated });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:groupId/grade-settings/:gradeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-grade-in-group', { params: req.params, payload: req.body });
      const { groupId, gradeId } = req.params;

      const checkValidateData = UpdateGradeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_15, validateErrorList: CreateMemberValidator.errors };
        logger.error('update-grade-in-group validate-error', { ...errorObject, debugMessage: CreateMemberValidator.errors });
        return res.status(400).json(errorObject);
      }

      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('update-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }
      if (!(await gradesRepository.isExist({ _id: gradeId }))) {
        logger.error('update-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_13);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_13);
      }

      const dataForUpdate = gradeDto.updateGradeDTO(groupId, req.body);
      logger.debug('data for create', dataForUpdate);

      const gradeUpdated = await gradesRepository.update(gradeId, dataForUpdate);

      logger.debug('response data', gradeUpdated);
      logger.info(`update-grade-in-group completed.`);
      return res.status(200).json(gradeUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:groupId/grade-settings/:gradeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-grade-in-group', { params: req.params });
      const { groupId, gradeId } = req.params;

      if (!(await groupRepository.checkGroupExist({ _id: groupId }))) {
        logger.error('delete-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_05);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_05);
      }

      if (!(await gradesRepository.isExist({ _id: gradeId }))) {
        logger.error('delete-grade-in-group error', ErrorSetOfGroup.BIQ_GRP_13);
        return res.status(400).json(ErrorSetOfGroup.BIQ_GRP_13);
      }

      const gradeDeleted = await gradesRepository.deleteOne({ _id: gradeId, groupId });

      logger.debug('response data', gradeDeleted);
      logger.info(`delete-grade-in-group completed.`);
      return res.status(200).json({ removed: gradeDeleted });
    } catch (error) {
      const errorObject = { ...ErrorSetOfGroup.BIQ_GRP_00 };
      logger.critical(ErrorSetOfGroup.BIQ_GRP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = GroupsController;
