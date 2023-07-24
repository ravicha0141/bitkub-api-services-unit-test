const express = require('express');
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const { QueryVarianceDTO } = require('../dto/variance.dto');
const { removingUndefined } = require('../utilities');
const { createVarianceData, updateVarianceData } = require('../validator/variances/variance.validator');
const { ErrorSetOfVariance } = require('../constants/error-sets');
const { TrackTypeEnum } = require('../constants/forms/track-type.constants');
const { VarianceStatusEnum } = require('../constants/variances.constants');
const { CalculateVarianceResult } = require('../utilities/variances.util');
const { LoggerServices } = require('../logger');
const varianceDto = require(path.resolve(`${__dir}/src/dto/variance.dto`));
const serviceName = 'variances';

const VariancesController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    varianceRepository,
    evaluateRepository,
    resultEvaluateOfCriteriaQaCsRepository,
    resultEvaluateOfCriteriaKycRepository,
    assignmentRepository,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-variance', { query: req.query });
      const { startDate: startDateFormat, endDate: endDateFormat } = req.query;

      const raw = QueryVarianceDTO(req.query);

      const startDate = startDateFormat ? moment(startDateFormat, 'YYYY-MM-DD').tz('Asia/Bangkok').startOf('day').unix() : undefined;
      const endDate = endDateFormat ? moment(endDateFormat, 'YYYY-MM-DD').tz('Asia/Bangkok').endOf('day').unix() : undefined;
      raw.createdAt = removingUndefined({ $gt: startDate, $lt: endDate });
      const allowedQuery = removingUndefined(raw);
      logger.debug('query for get data', allowedQuery);
      const listOfVariances = await varianceRepository.getListByFilter(allowedQuery);

      logger.debug('response data', { length: listOfVariances.length, sample: listOfVariances.slice(0, 2) });
      res.status(200).json(listOfVariances);
      logger.info(`get-list-variance completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:varianceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-variance', { params: req.params });
      const varianceData = await varianceRepository.findOneByFilter({ _id: req.params.varianceId });
      if (!varianceData) {
        logger.error(`get-variance error.`, ErrorSetOfVariance.BIQ_VRN_07);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_07);
      }

      logger.debug('variance data', varianceData);
      const { trackType, assignmentId } = varianceData;
      const { _id: evaluateId } = await evaluateRepository.findOneByFilter({ assignmentId });
      varianceData.results =
        trackType == TrackTypeEnum.QA_CS ? await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId }) : [];

      logger.debug('response data', varianceData);
      res.status(200).json(varianceData);
      logger.info('get-variance completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const { _id: superVisorId, email: superVisorEmail } = req.user;
      logger.debug('create-variance', { payload: req.body });
      const checkValidateData = createVarianceData(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_03, validateErrorList: createVarianceData.errors };
        logger.error(`create-variance validate-error.`, { ...errorObject, debugMessage: createVarianceData.errors });
        return res.status(400).json(errorObject);
      }
      const { evaluateId } = req.body;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error(`create-variance error.`, ErrorSetOfVariance.BIQ_VRN_02);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_02);
      }
      logger.debug('evaluate data', evaluateData);
      const varianceCheckDup = await varianceRepository.findOneByFilter({ evaluateId });
      if (varianceCheckDup) {
        logger.error(`create-variance error.`, ErrorSetOfVariance.BIQ_VRN_06);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_06);
      }

      const dataBodyForCreate = varianceDto.createVarianceDTO({ ...evaluateData, evaluateId, superVisorId, superVisorEmail });
      logger.debug('data for create variance', dataBodyForCreate);
      const varianceCreated = await varianceRepository.create(dataBodyForCreate);
      if (!varianceCreated) {
        logger.error(`create-variance error.`, ErrorSetOfVariance.BIQ_VRN_05);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_05);
      }
      logger.debug('variance data', varianceCreated);
      const assignmentUpdated = await assignmentRepository.updateAssignmentByIdWithObject(evaluateData.assignmentId, {
        varianced: true,
        varianceId: varianceCreated['_id'],
      });
      const returnData = { varianceCreated, assignmentUpdated };

      logger.debug('response data', returnData);
      res.status(200).json(returnData);
      logger.info('create-variance completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:varianceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-field-variance', { params: req.params, payload: req.body });
      const checkValidateData = updateVarianceData(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_04, validateErrorList: updateVarianceData.errors };
        logger.error('update-field-variance validate-error', { ...errorObject, debugMessage: updateVarianceData.errors });
        return res.status(400).json(errorObject);
      }
      const { varianceId } = req.params;
      const varianceCheckExist = await varianceRepository.findOneByFilter({ _id: varianceId });
      if (!varianceCheckExist) {
        logger.error('update-field-variance error', ErrorSetOfVariance.BIQ_VRN_07);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_07);
      }
      logger.debug('variance data', varianceCheckExist);
      let dataForUpdate = req.body;
      const { assignmentId, evaluateId, trackType } = varianceCheckExist;
      if (req.body.status === VarianceStatusEnum.COMPLETED) {
        const arrayVarainceResult = [];
        if (trackType === TrackTypeEnum.QA_CS) {
          const resultEvaluateList = await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId });
          for (const result of resultEvaluateList) {
            const varianceResult = result?.values.find((obj) => obj['field'] === 'varianceResult');
            if (varianceResult) arrayVarainceResult.push(varianceResult?.value);
          }
          const assignmentUpdate = await assignmentRepository.updateAssignmentByIdWithObject(assignmentId, { varianced: true, varianceId });
          if (assignmentUpdate) {
            dataForUpdate.differenceValue = CalculateVarianceResult(arrayVarainceResult);
          }
        } else if (trackType === TrackTypeEnum.KYC) {
          const resultEvaluate = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ evaluateId });
          if (resultEvaluate) {
            const { listQuestions } = resultEvaluate;
            for (const result of listQuestions) {
              arrayVarainceResult.push(result?.varianceResult);
            }
          }
          assignmentRepository.updateAssignmentByIdWithObject(assignmentId, { varianced: true, varianceId });
          dataForUpdate.differenceValue = CalculateVarianceResult(arrayVarainceResult);
        }
      }
      logger.debug('data for update assignment', dataForUpdate);

      const varianceUpdated = await varianceRepository.update(varianceId, dataForUpdate);
      if (!varianceUpdated) {
        logger.error('update-field-variance error', ErrorSetOfVariance.BIQ_VRN_08);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_08);
      }

      logger.debug('response data', varianceUpdated);
      res.status(200).json(varianceUpdated);
      logger.info('update-field-variance completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.patch('/:varianceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-field-variance', { params: req.params, payload: req.body });
      const checkValidateData = updateVarianceData(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_04, validateErrorList: updateVarianceData.errors };
        logger.error('update-field-variance validate-error', { ...errorObject, debugMessage: updateVarianceData.errors });
        return res.status(400).json(errorObject);
      }
      const { varianceId } = req.params;
      const varianceCheckExist = await varianceRepository.findOneByFilter({ _id: varianceId });
      if (!varianceCheckExist) {
        logger.error('update-field-variance error', ErrorSetOfVariance.BIQ_VRN_07);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_07);
      }
      logger.debug('variance data', varianceCheckExist);
      const dataForUpdate = req.body;
      const { assignmentId, evaluateId, trackType } = varianceCheckExist;
      if (req.body.status === VarianceStatusEnum.COMPLETED) {
        const arrayVarainceResult = [];
        if (trackType === TrackTypeEnum.QA_CS) {
          const resultEvaluateList = await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId });
          for (const result of resultEvaluateList) {
            const varianceResult = result?.values.find((obj) => obj['field'] === 'varianceResult');
            if (varianceResult) arrayVarainceResult.push(varianceResult?.value);
          }
          const assignmentUpdate = await assignmentRepository.updateAssignmentByIdWithObject(assignmentId, { varianced: true, varianceId });
          if (assignmentUpdate) {
            dataForUpdate.differenceValue = CalculateVarianceResult(arrayVarainceResult);
          }
        } else if (trackType === TrackTypeEnum.KYC) {
          const resultEvaluate = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ evaluateId });
          if (resultEvaluate) {
            const { listQuestions } = resultEvaluate;
            for (const result of listQuestions) {
              arrayVarainceResult.push(result?.varianceResult);
            }
          }
          assignmentRepository.updateAssignmentByIdWithObject(assignmentId, { varianced: true, varianceId });
          dataForUpdate.differenceValue = CalculateVarianceResult(arrayVarainceResult);
        }
      }
      logger.debug('data for update assignment', dataForUpdate);

      const varianceUpdated = await varianceRepository.update(varianceId, dataForUpdate);
      if (!varianceUpdated) {
        logger.error('update-field-variance error', ErrorSetOfVariance.BIQ_VRN_08);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_08);
      }

      logger.debug('response data', varianceUpdated);
      res.status(200).json(varianceUpdated);
      logger.info('update-field-variance completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:varianceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-assignment', { params: req.params });
      const { varianceId } = req.params;
      const varianceData = await varianceRepository.findOneByFilter({ _id: varianceId });
      if (!varianceData) {
        logger.error('delete-variance error', ErrorSetOfVariance.BIQ_VRN_07);
        return res.status(400).json(ErrorSetOfVariance.BIQ_VRN_07);
      }
      logger.debug('variance data', varianceData);
      const varianceRemoved = await varianceRepository.deleteOne(varianceId);

      logger.debug('response data', varianceRemoved);
      res.status(200).json(varianceRemoved);
      logger.info('delete-variance completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfVariance.BIQ_VRN_00 };
      logger.critical(ErrorSetOfVariance.BIQ_VRN_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = VariancesController;
