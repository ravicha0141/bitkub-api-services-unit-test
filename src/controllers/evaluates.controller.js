const express = require('express');
const moment = require('moment-timezone');
const path = require('path');
const __dir = require('app-root-path');
const { CreateEvaluateValidator, UpdateEvaluateValidator } = require('../validator/evaluates/evaluates.validator');
const { TrackTypeEnum } = require('../constants/forms/track-type.constants');
const { TransferQuestionForCriteriaKycDto, TransferItemForCriteriaKycDto } = require('../dto/feedbacks.dto');
const {
  createResultOfBadAnalysisFormValidator,
  updateResultOfBadAnalysisFormValidator,
} = require('../validator/templates/forms/result-of-bad-analysis.validator');
const {
  createResultOfCriteriaKycValidator,
  updateResultOfCriteriaKycValidator,
} = require('../validator/templates/forms/result-of-criteria-kyc.validator');
const { CreateOnBreakTimeValidator, UpdateOnBreakTimeValidator } = require('../validator/evaluates/on-break-times.validator');
const { ErrorSetOfEvaluate } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const { updateResultEvaluateOfQaCsDTO } = require('../dto/evaluate.dto');
const {
  updateResultOfCriteriaQaCsValidator,
  createResultOfCriteriaQaCsValidator,
} = require('../validator/templates/forms/result-of-criteria-qacs.validator');
const evaluateDto = require(path.resolve(`${__dir}/src/dto/evaluate.dto`));
const { convertDateToDateFormat } = require(path.resolve(`${__dir}/src/utilities`));
const serviceName = 'evaluates';

const EvaluatesController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    assignmentRepository,
    evaluateRepository,
    attachmentRepository,
    agentRepository,
    userRepository,
    auditlogRepository,
    memberRepository,
    criteriaQaCsQuestionRepository,
    criteriaQaCsItemQuestionRepository,
    criteriaKycRepository,
    resultEvaluateOfBadAnalysisRepository,
    resultEvaluateOfCriteriaQaCsRepository,
    resultEvaluateOfCriteriaKycRepository,
    onBreakTimeUseCase,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-evaluates', { query: req.query });
      const filter = req.query;
      if (filter?.['monitoringDate']) delete filter['monitoringDate'];
      if (filter?.['completedDate']) {
        const startDate = moment(filter?.['completedDate']).tz('Asia/Bangkok').toDate();
        const endDate = moment(filter?.['completedDate']).tz('Asia/Bangkok').toDate();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 0);
        filter['completedDate'] = { $gt: startDate, $lt: endDate };
      }
      const listOfAssignments = await evaluateRepository.getListByFilter(filter);
      const arrayList = [];
      for (const assignment of listOfAssignments) {
        if (req.query['monitoringDate']) {
          const monitoringDate = convertDateToDateFormat(assignment['monitoringDate']);
          if (req.query['monitoringDate'] === monitoringDate) {
            const monitoringTime = convertDateToDateFormat(assignment['monitoringTime']);
            arrayList.push({ ...assignment, monitoringDate, monitoringTime });
          }
          continue;
        } else {
          const monitoringDate = convertDateToDateFormat(assignment['monitoringDate']);
          const monitoringTime = convertDateToDateFormat(assignment['monitoringTime']);
          arrayList.push({ ...assignment, monitoringDate, monitoringTime });
        }
      }
      logger.info('get-list-of-evaluates completed.');
      return res.status(200).json(arrayList);
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:evaluateId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-evaluate', { params: req.params });
      const { evaluateId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('get-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', evaluateData);
      let fileData = {};
      if (evaluateData['fileType'] === 'voice') {
        fileData = await attachmentRepository.getStorageFileById(evaluateData.fileId);
        if (!fileData) {
          logger.error('get-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_07);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_07);
        }
        logger.debug('file data in evaluate', fileData);
      }
      const listResultsData = await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId: evaluateId });
      logger.info('get-evaluate completed.');
      return res.status(200).json({ ...evaluateData, fileData, listResultsData });
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-evaluate', { payload: req.body });
      const checkValidateData = CreateEvaluateValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_03, validateErrorList: CreateEvaluateValidator.errors };
        logger.error('create-evaluate validate-error', { ...errorObject, debugMessage: CreateEvaluateValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { assignmentId, qaAgentId, agentId, trackType, fileId } = req.body;

      const [assignmentData, qaAgentData, agentData, memberData] = await Promise.all([
        assignmentRepository.getOneWithFilter({ _id: assignmentId }),
        userRepository.getOneUserByFilter({ _id: qaAgentId }),
        agentRepository.getOneByFilter({ _id: agentId }),
        memberRepository.getOneWithFilter({ userId: qaAgentId }),
      ]);

      if (!assignmentData) {
        logger.error('create-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_04);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_04);
      }
      logger.debug('assignment data', assignmentData);
      if (!qaAgentData || qaAgentData['level'] !== 'qaAgent') {
        logger.error('create-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_05);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_05);
      }
      logger.debug('qa agent user data', qaAgentData);
      if (!agentData) {
        logger.error('create-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_06);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_06);
      }
      logger.debug('agent data', agentData);
      logger.debug('member data', memberData);

      const filterCheckDuplicate = { assignmentId, trackType, qaAgentId, agentId };
      if (assignmentData['fileType'] === 'voice') {
        const fileData = await attachmentRepository.getStorageFileById(fileId);
        if (!fileData) {
          logger.error('create-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_07);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_07);
        }
        logger.debug('file data', fileData);
        filterCheckDuplicate['fileId'] = fileId;
      }
      const evaluateData = await evaluateRepository.findOneByFilter(filterCheckDuplicate);
      if (evaluateData) {
        logger.error('create-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_08);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_08);
      }
      logger.debug('evaluate data', evaluateData);

      const bodyDataForCreate = {
        ...req.body,
        groupId: memberData?.groupId || '',
        formId: assignmentData.formId,
        taskNumber: assignmentData.taskNumber,
        assignmentRef: assignmentData.fileName,
        agentId: agentData._id,
        agentName: agentData.name,
        agentEmail: agentData.email,
        fileId: assignmentData.fileId || '',
        fileType: assignmentData.fileType || '',
        fileName: assignmentData.fileName || '',
        fileSize: assignmentData.fileSize || null,
        qaAgentEmail: qaAgentData['email'] || '',
        agentEmployeeId: agentData.employeeId || '',
      };
      const createEvaluateDTO = await evaluateDto.createEvaluateDTO(bodyDataForCreate);
      logger.debug('data for create evaluate', createEvaluateDTO);
      const createdData = await evaluateRepository.create(createEvaluateDTO);

      auditlogRepository
        .create({
          userId: createdData['qaAgentId'],
          service: 'evaluate',
          action: 'evaluate-started',
          properties: createdData,
        })
        .then((logCreated) => logger.debug('auditlog created', logCreated))
        .catch((error) => logger.error('create-evaluate error-create-auditlog', { error }));

      logger.debug('response data', createdData);
      res.status(200).json(createdData);
      logger.info('create-evaluate completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:evaluateId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-evaluate', { params: req.params, payload: req.body });
      const checkValidateData = UpdateEvaluateValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: UpdateEvaluateValidator.errors };
        logger.error('update-evaluate validate-error', { ...errorObject, debugMessage: CreateEvaluateValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { evaluateId } = req.params;
      const foundedEvaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!foundedEvaluateData) {
        logger.error('update-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', foundedEvaluateData);
      const dataForUpdateEvaluate = await evaluateDto.updateEvaluateDTO(req.body);
      if (req.body?.status === 'completed') dataForUpdateEvaluate.completedDate = new Date();
      logger.debug('data for update', dataForUpdateEvaluate);
      const updatedData = await evaluateRepository.update(evaluateId, dataForUpdateEvaluate);
      try {
        if (updatedData['status'] === 'completed') {
          const filterAuditlogStartEvaluated = {
            userId: updatedData['qaAgentId'],
            service: 'evaluate',
            action: 'evaluate-started',
            'properties._id': evaluateId,
          };
          const evaluateStart = await auditlogRepository.getOneByFilter(filterAuditlogStartEvaluated);
          if (evaluateStart) {
            const { createdAt: startEvaluate } = evaluateStart;
            const dataForCreateAuditlog = {
              userId: updatedData['qaAgentId'],
              service: 'evaluate',
              action: 'evaluate-completed',
              'properties._id': evaluateId,
            };
            const evaluateCompleted = await auditlogRepository.getOneByFilter(dataForCreateAuditlog);
            if (!evaluateCompleted) {
              const unixTimeNow = moment().tz('Asia/Bangkok').unix();
              const processTime = unixTimeNow - startEvaluate;
              auditlogRepository.create({ ...dataForCreateAuditlog, properties: updatedData, processTime });
            } else {
              const { createdAt: completedAt, _id } = evaluateCompleted.properties;
              const processTime = completedAt - startEvaluate;
              auditlogRepository.findByIdAndUpdateById(_id, { processTime });
            }
          }
          logger.debug('update net score in assignment');
        }
      } catch (error) {
        logger.critical('error create auditlog', { message: error.message });
      }

      logger.debug('response data', updatedData);
      res.status(200).json(updatedData);
      logger.info('update-evaluate completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:evaluateId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-evaluate', { params: req.params });
      const { evaluateId } = req.params;
      const foundedEvaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!foundedEvaluateData) {
        logger.error('delete-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      const updatedData = await evaluateRepository.deleteOne(req.params.evaluateId);

      if (!updatedData) {
        logger.error('delete-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_09);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_09);
      }
      logger.debug('evaluate removed', updatedData);
      const { trackType } = foundedEvaluateData;
      if (trackType === TrackTypeEnum.QA_CS) {
        const resultRemoved = await resultEvaluateOfCriteriaQaCsRepository.deleteMany({ evaluateId });
        logger.debug('result removed', { resultRemoved, trackType });
      } else if (trackType === TrackTypeEnum.KYC) {
        const resultRemoved = await resultEvaluateOfCriteriaKycRepository.removeItemMany(evaluateId);
        logger.debug('result removed', { resultRemoved, trackType });
      } else if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const resultRemoved = await resultEvaluateOfBadAnalysisRepository.removeItemMany(evaluateId);
        logger.debug('result removed', { resultRemoved, trackType });
      }
      logger.debug('response data', foundedEvaluateData);
      res.status(200).json(foundedEvaluateData);
      logger.info('delete-evaluate completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:evaluateId/results', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-result-of-evaluate', { query: req.query });
      const { evaluateId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('get-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', evaluateData);
      const { trackType } = evaluateData;
      if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const listOfResultOfBadAnalysis = await resultEvaluateOfBadAnalysisRepository.getListByFilter({ evaluateId });
        logger.info('get-result-of-evaluate completed.');
        return res.status(200).json(listOfResultOfBadAnalysis);
      } else if (trackType === TrackTypeEnum.KYC) {
        const listResultOfKyc = await resultEvaluateOfCriteriaKycRepository.getListByFilter({ evaluateId });
        logger.info('get-result-of-evaluate completed.');
        return res.status(200).json(listResultOfKyc);
      } else if (trackType === TrackTypeEnum.QA_CS) {
        const listResultsData = await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId });
        logger.info('get-result-of-evaluate completed.');
        return res.status(200).json(listResultsData);
      } else {
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:evaluateId/results/:resultId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-result-of-evaluate', { params: req.params });
      const { evaluateId, resultId } = req.params;
      const foundedEvaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!foundedEvaluateData) {
        logger.error('get-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      const { trackType } = foundedEvaluateData;
      let resultData = {};
      if (trackType === TrackTypeEnum.QA_CS) {
        logger.debug('evaluate data', foundedEvaluateData);
        const foundedResultData = await resultEvaluateOfCriteriaQaCsRepository.findOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('get-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        resultData = foundedResultData;
      } else if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const foundedResultData = await resultEvaluateOfBadAnalysisRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('get-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        resultData = foundedResultData;
      } else if (trackType === TrackTypeEnum.KYC) {
        const foundedResultData = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('get-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        resultData = foundedResultData;
      }
      logger.info('get-result-of-evaluate completed.');
      return res.status(200).json(resultData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:evaluateId/results', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-result-of-evaluate', { params: req.params, payload: req.body });
      const { evaluateId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('create-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', evaluateData);
      const { trackType, groupId } = evaluateData;
      if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const resultsData = { evaluateId, groupId, ...req.body };
        logger.debug('data for create result of evaluate bad analysis', resultsData);
        const checkValidateData = createResultOfBadAnalysisFormValidator(resultsData);
        if (!checkValidateData) {
          const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: createResultOfBadAnalysisFormValidator.errors };
          logger.error('create-result-of-evaluate validate-error', {
            ...errorObject,
            debugMessage: createResultOfBadAnalysisFormValidator.errors,
          });
          return res.status(400).json(errorObject);
        }
        const { formId: badAnalysisId } = resultsData;
        const resultOfBadAnalysisCreated = await resultEvaluateOfBadAnalysisRepository.create({ ...resultsData, badAnalysisId });
        logger.info('create-result-of-evaluate completed.');
        return res.status(200).json(resultOfBadAnalysisCreated);
      } else if (trackType === TrackTypeEnum.QA_CS) {
        logger.debug('data for create result of evaluate criteria qa cs', req.body);
        const checkValidateData = createResultOfCriteriaQaCsValidator(req.body);
        if (!checkValidateData) {
          const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: createResultOfCriteriaQaCsValidator.errors };
          logger.error('create-result-of-evaluate validate-error', {
            ...errorObject,
            debugMessage: createResultOfCriteriaQaCsValidator.errors,
          });
          return res.status(400).json(errorObject);
        }
        const resultsData = { evaluateId, groupId, ...req.body };
        const resultEvaluateCreated = await resultEvaluateOfCriteriaQaCsRepository.create(resultsData);
        logger.info('create-result-of-evaluate completed.');
        return res.status(200).json(resultEvaluateCreated);
      } else if (trackType === TrackTypeEnum.KYC) {
        logger.debug('data for create result of evaluate criteria kyc', req.body);
        const checkValidateData = createResultOfCriteriaKycValidator(req.body);
        if (!checkValidateData) {
          logger.error('create-result-of-evaluate error', createResultOfCriteriaKycValidator.errors);
          return res.status(400).json({ ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: createResultOfCriteriaKycValidator.errors });
        }
        const { formId: criteriaKycFormId } = req.body;
        const resultsData = { evaluateId, groupId, ...req.body, criteriaKycFormId };
        const resultOfKycCreated = await resultEvaluateOfCriteriaKycRepository.create(resultsData);
        logger.info('create-result-of-evaluate completed.');
        return res.status(200).json(resultOfKycCreated);
      } else {
        logger.error('create-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_14);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_14);
      }
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:evaluateId/results/:resultId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-result-of-evaluate', { params: req.params, payload: req.body });
      const { evaluateId, resultId } = req.params;
      const foundedEvaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!foundedEvaluateData) {
        logger.error('update-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', foundedEvaluateData);
      const { trackType } = foundedEvaluateData;
      logger.debug('evaluate tracktype', trackType);
      if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const foundedResultData = await resultEvaluateOfBadAnalysisRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('update-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        logger.debug('payload for update bad analysis result', req.body);
        const checkValidateData = updateResultOfBadAnalysisFormValidator(req.body);
        if (!checkValidateData) {
          const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: updateResultOfBadAnalysisFormValidator.errors };
          logger.error('update-result-of-evaluate validate-error', {
            ...errorObject,
            debugMessage: updateResultOfBadAnalysisFormValidator.errors,
          });
          return res.status(400).json(errorObject);
        }
        const resultOfBadAnalysisUpdated = await resultEvaluateOfBadAnalysisRepository.update(resultId, req.body);
        logger.info('update-result-of-evaluate completed.');
        return res.status(200).json(resultOfBadAnalysisUpdated);
      } else if (trackType === TrackTypeEnum.QA_CS) {
        logger.debug('payload for update criteria-qacs result', req.body);
        const checkValidateData = updateResultOfCriteriaQaCsValidator(req.body);
        if (!checkValidateData) {
          const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: updateResultOfCriteriaQaCsValidator.errors };
          logger.error('update-result-of-evaluate validate-error', {
            ...errorObject,
            debugMessage: updateResultOfCriteriaQaCsValidator.errors,
          });
          return res.status(400).json(errorObject);
        }
        const foundedResultData = await resultEvaluateOfCriteriaQaCsRepository.findOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('update-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }

        const dataForUpdate = updateResultEvaluateOfQaCsDTO(req.body);
        logger.debug('payload for update criteria qacs result', dataForUpdate);
        const updatedData = await resultEvaluateOfCriteriaQaCsRepository.update(resultId, dataForUpdate);
        logger.info('update-result-of-evaluate completed.');
        return res.status(200).json(updatedData);
      } else if (trackType === TrackTypeEnum.KYC) {
        const foundedResultData = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('update-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        logger.debug('payload for update criteria kyc result', req.body);
        const checkValidateData = updateResultOfCriteriaKycValidator(req.body);
        if (!checkValidateData) {
          const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_12, validateErrorList: updateResultOfCriteriaKycValidator.errors };
          logger.error('update-result-of-evaluate validate-error', {
            ...errorObject,
            debugMessage: updateResultOfCriteriaKycValidator.errors,
          });
          return res.status(400).json(errorObject);
        }
        const resultOfCriteriaKycUpdated = await resultEvaluateOfCriteriaKycRepository.update(resultId, req.body);
        logger.info('update-result-of-evaluate completed.');
        return res.status(200).json(resultOfCriteriaKycUpdated);
      } else {
        logger.error('update-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_14);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_14);
      }
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:evaluateId/results/:resultId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-result-of-evaluate', { params: req.params });
      const { evaluateId, resultId } = req.params;
      const foundedEvaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!foundedEvaluateData) {
        logger.error('delete-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', foundedEvaluateData);
      const { trackType } = foundedEvaluateData;
      if (trackType === TrackTypeEnum.QA_CS) {
        const removedData = await resultEvaluateOfCriteriaQaCsRepository.deleteOne(resultId);
        logger.debug('result qa cs removed', removedData);
        logger.info('delete-result-of-evaluate completed.');
        return res.status(200).json(removedData);
      } else if (trackType === TrackTypeEnum.KYC) {
        const foundedResultData = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('delete-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        const resultOfCriteriaKycRemoved = await resultEvaluateOfCriteriaKycRepository.removeItem(resultId);
        logger.debug('result kyc removed', resultOfCriteriaKycRemoved);
        logger.info('delete-result-of-evaluate completed.');
        return res.status(200).json(foundedResultData);
      } else if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
        const foundedResultData = await resultEvaluateOfBadAnalysisRepository.getOneByFilter({ _id: resultId });
        if (!foundedResultData) {
          logger.error('delete-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_10);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_10);
        }
        const resultOfBadAnalysisRemoved = await resultEvaluateOfBadAnalysisRepository.removeItem(resultId);
        logger.debug('result of bad analysis removed ', resultOfBadAnalysisRemoved);
        logger.info('delete-result-of-evaluate completed.');
        return res.status(200).json(foundedResultData);
      } else {
        logger.error('delete-result-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_14);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_14);
      }
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:evaluateId/feedback', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-feedback-of-evaluate', { params: req.params });
      const { evaluateId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('get-list-feedback-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', evaluateData);
      let fileData = null;
      if (evaluateData['fileType'] === 'voice') {
        fileData = await attachmentRepository.getStorageFileById(evaluateData.fileId);
        logger.debug('file data', fileData);
        if (!fileData) {
          logger.error('get-list-feedback-of-evaluate error', ErrorSetOfEvaluate.BIQ_EVT_07);
          return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_07);
        }
      }
      const { trackType, formId } = evaluateData;
      const dataConverted = JSON.parse(JSON.stringify(evaluateData));
      logger.debug('trackType', { trackType });
      if (trackType === TrackTypeEnum.QA_CS) {
        const resultData = await resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId });
        const listResultsData = [];
        const listItem = await criteriaQaCsItemQuestionRepository.getListByFilter({ formId });
        const listOfQuestion = await criteriaQaCsQuestionRepository.getListOfQuestionsByFilter({ formId });
        for (const question of listOfQuestion) {
          const results = [];
          const { title, weight } = question;
          const questionId = question['_id'];
          for (const item of listItem) {
            if (item['questionId'] === questionId) {
              const resultItem = resultData.find((result) => result['referId'] == item['_id']);
              if (resultItem) results.push({ ...resultItem });
            }
          }
          listResultsData.push({ questionId, questionTitle: title, questionWeight: weight, results });
          logger.debug('list result', listResultsData);
        }
        logger.info('get-list-feedback-of-evaluate completed.');
        return res.status(200).json({ ...dataConverted, listResultsData });
      } else if (trackType === TrackTypeEnum.KYC) {
        const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formId });
        const resultData = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ evaluateId });
        const listResultsData = [];
        const { listQuestions } = criteriaKycData;
        const arrayColumnValues = ['qaAction', 'finalWeight', 'fatal'];
        for (const question of listQuestions) {
          const customQuestionReturn = {
            order: question['order'],
            title: question['title'],
            detail: question['detail'],
            nonFatal: question['nonFatal'],
            weight: question['weight'],
          };
          const listQuestionsInResults = resultData['listQuestions'];
          const foundedResultData = listQuestionsInResults.find((obj) => obj['questionId'] === question['_id']);
          const itemLists = [];
          const { listItems, nonFatal } = question;
          const { weightageScore } = foundedResultData;
          for (const item of listItems) {
            const values = [
              {
                columnKey: 'qaAction',
                value: foundedResultData['result'],
              },
              {
                columnKey: 'finalWeight',
                value: `${weightageScore}%`,
              },
            ];
            if (!nonFatal) {
              values.push({
                columnKey: 'fatal',
                value: `Fatal`,
              });
            }
            itemLists.push(TransferItemForCriteriaKycDto({ ...item, values }));
          }
          listResultsData.push(TransferQuestionForCriteriaKycDto({ ...customQuestionReturn, itemLists }));
        }
        logger.info('get-list-feedback-of-evaluate completed.');
        return res.status(200).json({ ...dataConverted, arrayColumnValues, listResultsData });
      }
      logger.info('get-list-feedback-of-evaluate completed.');
      return res.status(200).json({ ...dataConverted, fileData });
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:evaluateId/on-break-time', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-on-break-time', { payload: req.body });
      const checkValidateData = CreateOnBreakTimeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_15, validateErrorList: CreateOnBreakTimeValidator.errors };
        logger.error('create-on-break-time validate-error', { ...errorObject, debugMessage: CreateOnBreakTimeValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { evaluateId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('create-on-break-time error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('evaluate data', evaluateData);
      const onBreakTimeCreated = await onBreakTimeUseCase.createOnBreakTime(evaluateData, req.body);
      logger.debug('on break time created', onBreakTimeCreated);
      logger.info('create-on-break-time completed.');
      return res.status(200).json(onBreakTimeCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:evaluateId/on-break-time/:onBreakTimeId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-on-break-time', { params: req.params });
      const { evaluateId, onBreakTimeId } = req.params;
      const evaluateData = await evaluateRepository.findOneByFilter({ _id: evaluateId });
      if (!evaluateData) {
        logger.error('update-on-break-time error', ErrorSetOfEvaluate.BIQ_EVT_01);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_01);
      }
      logger.debug('payload for update on break time', req.body);
      const checkValidateData = UpdateOnBreakTimeValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_16, validateErrorList: UpdateOnBreakTimeValidator.errors };
        logger.error('update-on-break-time validate-error', { ...errorObject, debugMessage: UpdateOnBreakTimeValidator.errors });
        return res.status(400).json(errorObject);
      }
      const onBreakTimeUpdated = await onBreakTimeUseCase.updateOnBreakTime(onBreakTimeId, req.body);
      if (!onBreakTimeUpdated) {
        logger.error('update-on-break-time error', ErrorSetOfEvaluate.BIQ_EVT_17);
        return res.status(400).json(ErrorSetOfEvaluate.BIQ_EVT_17);
      }
      logger.debug('on break time updated', onBreakTimeUpdated);
      logger.info('update-on-break-time completed.');
      return res.status(200).json(onBreakTimeUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfEvaluate.BIQ_EVT_00 };
      logger.critical(ErrorSetOfEvaluate.BIQ_EVT_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = EvaluatesController;
