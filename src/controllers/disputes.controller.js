const express = require('express');
const moment = require('moment-timezone');
const path = require('path');
const __dir = require('app-root-path');
const { UpdateDisputeValidator, CreateDisputeValidator } = require('../validator/disputes.validator');
const { ErrorSetOfAssignment } = require('../constants/error-sets');
const { ErrorSetOfDispute } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const disputeDto = require(path.resolve(`${__dir}/src/dto/disputes.dto`));
const { convertDateToDateFormat } = require(path.resolve(`${__dir}/src/utilities`));
const serviceName = 'disputes';

const DisputesController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { disputeRepository, assignmentRepository, auditlogRepository } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-dispute', { query: req.query });
      let filter = { ...req['query'] };
      if (req['query']['startDate'] || req['query']['endDate']) {
        let dateOfMonitoring = {};
        if (req['query']['startDate']) dateOfMonitoring['$gt'] = req['query']['startDate'];
        if (req['query']['endDate']) dateOfMonitoring['$lt'] = req['query']['endDate'];
        filter = {
          dateOfMonitoring,
        };
      }

      logger.debug('filter dispute', filter);
      const listOfDisputes = await disputeRepository.getListOfDisputesByFilter(filter);
      if (!listOfDisputes) {
        logger.error(`get-list-dispute error.`, ErrorSetOfDispute.BIQ_DSP_06);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_06);
      }

      const arrayList = listOfDisputes.map((dispute) => {
        dispute.qaReasonDate = convertDateToDateFormat(dispute['qaReasonDate']);
        dispute.dateOfMonitoring = convertDateToDateFormat(dispute['dateOfMonitoring']);
        return dispute;
      });

      logger.debug('response data', { length: arrayList.length, sample: arrayList.slice(0, 2) });
      res.status(200).json(arrayList);
      logger.debug('get-list-dispute', arrayList.length);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_00 };
      logger.critical(ErrorSetOfDispute.BIQ_DSP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:disputeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-dispute', { params: req.params });
      const disputeData = await disputeRepository.getOneDisputeWithFilter({ _id: req.params.disputeId });
      if (!disputeData) {
        logger.error(`get-dispute error.`, ErrorSetOfDispute.BIQ_DSP_04);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_04);
      }

      logger.debug('response data', disputeData);
      res.status(200).json(disputeData);
      logger.debug('get-dispute', disputeData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_00 };
      logger.critical(ErrorSetOfDispute.BIQ_DSP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-dispute', { payload: req.body });
      const checkValidateData = CreateDisputeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_02, validateErrorList: CreateDisputeValidator.errors };
        logger.error('create-dispute validate-error', { ...errorObject, debugMessage: CreateDisputeValidator.errors });
        return res.status(400).json({ ...ErrorSetOfDispute.BIQ_DSP_02, validateErrorList: CreateDisputeValidator.errors });
      }
      const assignmentReadyExit = await assignmentRepository.getOneWithFilter({ _id: req.body.assignmentId });
      if (!assignmentReadyExit) {
        logger.error('create-dispute error', ErrorSetOfAssignment.BIQ_ASM_04);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_04);
      }
      logger.debug('assignment data', assignmentReadyExit);
      const { formId, taskNumber, trackType } = assignmentReadyExit;
      const dataBodyForCreate = disputeDto.createDisputeDTO({ ...req.body, formId, taskNumber, trackType });
      logger.debug('data body for create dispute', dataBodyForCreate);

      const disputeCreated = await disputeRepository.create(dataBodyForCreate);
      if (!disputeCreated) {
        logger.error('create-dispute error', ErrorSetOfDispute.BIQ_DSP_05);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_05);
      }

      auditlogRepository
        .create({
          userId: disputeCreated['qaAgent'],
          service: 'dispute',
          action: 'dispute-created',
          properties: disputeCreated,
        })
        .then((logCreated) => logger.debug('auditlog created', logCreated))
        .catch((error) => logger.error('create-dispute error-create-auditlog', { error }));

      logger.debug('response Data', disputeCreated);
      res.status(200).json(disputeCreated);
      logger.debug('create-dispute completed');
    } catch (error) {
      const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_00 };
      logger.critical(ErrorSetOfDispute.BIQ_DSP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:disputeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-dispute', { params: req.params, payload: req.body });
      const { disputeId } = req.params;
      const checkValidateData = UpdateDisputeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_02, validateErrorList: UpdateDisputeValidator.errors };
        logger.error('update-dispute validate-error', { ...errorObject, debugMessage: UpdateDisputeValidator.errors });
        return res.status(400).json(errorObject);
      }
      const disputeData = await disputeRepository.getOneDisputeWithFilter({ _id: disputeId });
      if (!disputeData) {
        logger.error('update-dispute error', ErrorSetOfDispute.BIQ_DSP_04);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_04);
      }
      logger.debug('dispute data', disputeData);

      const dataBodyForUpdate = disputeDto.updateDisputeDTO(req.body);
      logger.debug('data body for update', dataBodyForUpdate);
      const isCompleted = dataBodyForUpdate['disputeStatus'] === 'agreed' || dataBodyForUpdate['disputeStatus'] === 'disagreed';
      if (isCompleted) dataBodyForUpdate['completedDate'] = moment().tz('Asia/Bangkok').toDate();
      const disputeUpdated = await disputeRepository.updateWithObject(disputeId, dataBodyForUpdate);
      if (!disputeUpdated) {
        logger.error('update-dispute error', ErrorSetOfDispute.BIQ_DSP_05);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_05);
      }

      if (isCompleted) {
        auditlogRepository
          .create({
            userId: disputeUpdated['qaAgent'],
            service: 'dispute',
            action: 'dispute-completed',
            properties: disputeUpdated,
          })
          .then((logCreated) => logger.debug('auditlog created', logCreated))
          .catch((error) => logger.error('update-dispute error-create-auditlog', { error }));
      }

      logger.debug('response Data', disputeUpdated);
      res.status(200).json(disputeUpdated);
      logger.debug('update-dispute completed');
    } catch (error) {
      const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_00 };
      logger.critical(ErrorSetOfDispute.BIQ_DSP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:disputeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-dispute', { params: req.params });
      const { disputeId } = req.params;
      const disputeData = await disputeRepository.getOneDisputeWithFilter({ _id: disputeId });
      if (!disputeData) {
        logger.error('delete-dispute error', ErrorSetOfDispute.BIQ_DSP_04);
        return res.status(400).json(ErrorSetOfDispute.BIQ_DSP_04);
      }
      logger.debug('dispute data', disputeData);
      const disputeRemoved = await disputeRepository.deleteDisputeOne(disputeId);

      logger.debug('response data', disputeRemoved);
      res.status(200).json(disputeRemoved);
      logger.info(`delete-dispute completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDispute.BIQ_DSP_00 };
      logger.critical(ErrorSetOfDispute.BIQ_DSP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = DisputesController;
