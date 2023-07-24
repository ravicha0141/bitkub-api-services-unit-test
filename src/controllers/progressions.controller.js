const express = require('express');
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const { CreateProgressionValidator, UpdateProgressionValidator } = require('../validator/progressions.validator');
const { ErrorSetOfProgression } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const progressionDto = require(path.resolve(`${__dir}/src/dto/progression.dto`));

const serviceName = 'progressions';

const ProgressionController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { progressionRepository, userRepository, groupRepository, memberRepository, auditlogRepository } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-progression', { query: req.query });
      const progressionList = await progressionRepository.getAll(req.query);
      logger.debug('response data', { length: progressionList.length, sample: progressionList.slice(0, 2) });
      res.status(200).json(progressionList);
      logger.info(`get-list-progression completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_00 };
      logger.critical(ErrorSetOfProgression.BIQ_PGS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:progressId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-progression', { params: req.params });
      const { progressId } = req.params;
      const progressionData = await progressionRepository.getOneByFilter({ _id: progressId });
      if (!progressionData) {
        logger.error(`get-progression error.`, ErrorSetOfProgression.BIQ_PGS_05);
        return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_05);
      }

      logger.debug('response data', progressionData);
      res.status(200).json(progressionData);
      logger.info(`get-progression completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_00 };
      logger.critical(ErrorSetOfProgression.BIQ_PGS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-progression', { payload: req.body });
      const checkValidateData = CreateProgressionValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_01, validateErrorList: CreateProgressionValidator.errors };
        logger.error(`create-progression validate-error.`, { ...errorObject, debugMessage: CreateProgressionValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { qaAgentId } = req.body;
      const qaAgentUserData = await userRepository.getOneUserByFilter({ _id: qaAgentId });
      if (!qaAgentUserData) {
        logger.error(`create-progression error.`, ErrorSetOfProgression.BIQ_PGS_02);
        return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_02);
      }
      logger.debug('qa agent data', qaAgentUserData);

      const dateFormat = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
      const filterData = {
        qaAgentId: req.body.qaAgentId,
        date: dateFormat,
      };
      logger.debug('filter for get progression', filterData);
      const progressionData = await progressionRepository.getOneByFilter(filterData);
      if (progressionData) {
        logger.debug('progression data', progressionData);
        if (progressionData['date'] !== dateFormat) {
          logger.error(`create-progression error.`, ErrorSetOfProgression.BIQ_PGS_03);
          return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_03);
        }
        const { _id: processId } = progressionData;
        const dataForUpdate = progressionDto.updateProgressionDTO(req.body);
        if (!dataForUpdate) {
          logger.error(`create-progression error.`, ErrorSetOfProgression.BIQ_PGS_04);
          return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_04);
        }
        const progressionUpdated = await progressionRepository.update(processId, dataForUpdate);
        logger.debug('progression updated', progressionUpdated);
        auditlogRepository
          .getAll({
            userId: progressionUpdated['qaAgentId'],
            service: 'progression',
            action: 'onduty-started',
          })
          .then(async (ondutyLog) => {
            const logCreated = await auditlogRepository.create({
              userId: progressionUpdated['qaAgentId'],
              service: 'progression',
              action: 'onduty-started',
              tag: `${ondutyLog.length + 1}`,
              properties: progressionUpdated,
            });
            logger.debug('auditlog created', logCreated);
          })
          .catch((error) => logger.error('create-progression error-create-auditlog', { error }));

        logger.debug('response data', progressionUpdated);
        logger.info(`create-progression completed.`);
        return res.status(200).json(progressionUpdated);
      }
      const createProgressData = {
        ...req.body,
        qaAgentEmail: qaAgentUserData.email,
        groupId: '',
        groupName: '',
        date: dateFormat,
        startTime: moment().tz('Asia/Bangkok').unix(),
      };
      const memberData = await memberRepository.getOneWithFilter({ userId: qaAgentId });
      if (memberData) {
        logger.debug('member data', memberData);
        const groupData = await groupRepository.getGroupById(memberData.groupId);
        if (groupData) {
          logger.debug('group data', groupData);
          createProgressData.groupId = groupData['_id'];
          createProgressData.groupName = groupData['name'];
        }
      }
      logger.debug('data for create new progression', createProgressData);
      const dataForCreate = progressionDto.createProgressionDTO(createProgressData);
      if (!dataForCreate) {
        logger.error(`create-progression error.`, ErrorSetOfProgression.BIQ_PGS_04);
        return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_04);
      }
      const progressionCreated = await progressionRepository.create(dataForCreate);

      auditlogRepository
        .getAll({
          userId: progressionCreated['qaAgentId'],
          service: 'progression',
          action: 'onduty-started',
        })
        .then(async (ondutyLog) => {
          const logCreated = await auditlogRepository.create({
            userId: progressionCreated['qaAgentId'],
            service: 'progression',
            action: 'onduty-started',
            tag: `${ondutyLog.length + 1}`,
            properties: progressionCreated,
          });
          logger.debug('auditlog created', logCreated);
        })
        .catch((error) => logger.error('create-progression error-create-auditlog', { error }));

      logger.debug('response data', progressionCreated);
      res.status(200).json(progressionCreated);
      logger.info(`create-progression completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_00 };
      logger.critical(ErrorSetOfProgression.BIQ_PGS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:progressId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-progression', { params: req.params, payload: req.body });
      const checkValidateData = UpdateProgressionValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_06, validateErrorList: UpdateProgressionValidator.errors };
        logger.error(`update-progression validate-error.`, { ...errorObject, debugMessage: UpdateProgressionValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { progressId } = req.params;
      const progressData = await progressionRepository.getOneByFilter({ _id: progressId });
      if (!progressData) {
        logger.error(`update-progression error.`, ErrorSetOfProgression.BIQ_PGS_05);
        return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_05);
      }
      logger.debug('progression data', progressData);
      let { qaAgentId, groupId, groupName } = progressData;
      const startUnixTime = progressData?.startTime;
      const endUnixTime = moment().tz('Asia/Bangkok').unix();
      const amountTime = endUnixTime - startUnixTime;
      const memberData = await memberRepository.getOneWithFilter({ userId: qaAgentId });
      if (memberData) {
        logger.debug('member data', memberData);
        const groupData = await groupRepository.getGroupById(memberData?.groupId);
        if (groupData) {
          logger.debug('group data', groupData);
          groupId = groupData['_id'];
          groupName = groupData['name'];
        }
      }
      const updateProgressData = {
        ...req.body,
        amount: amountTime,
        groupId,
        groupName,
        endTime: moment().tz('Asia/Bangkok').unix(),
      };
      const dataForUpdate = progressionDto.updateProgressionDTO(updateProgressData);
      if (!dataForUpdate) {
        logger.error(`update-progression error.`, ErrorSetOfProgression.BIQ_PGS_04);
        return res.status(400).json(ErrorSetOfProgression.BIQ_PGS_04);
      }
      logger.debug('data for update progression', dataForUpdate);
      const progressionUpdated = await progressionRepository.update(progressId, dataForUpdate);

      auditlogRepository
        .getAll({
          userId: progressionUpdated['qaAgentId'],
          service: 'progression',
          action: 'onduty-ended',
        })
        .then(async (ondutyLog) => {
          const logCreated = await auditlogRepository.create({
            userId: progressionUpdated['qaAgentId'],
            service: 'progression',
            action: 'onduty-ended',
            tag: `${ondutyLog.length + 1}`,
            properties: progressionUpdated,
          });
          logger.debug('auditlog created', logCreated);
        })
        .catch((error) => logger.error('update-progression error-create-auditlog', { error }));

      logger.debug('response data', progressionUpdated);
      res.status(200).json(progressionUpdated);
      logger.info(`update-progression completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfProgression.BIQ_PGS_00 };
      logger.critical(ErrorSetOfProgression.BIQ_PGS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = ProgressionController;
