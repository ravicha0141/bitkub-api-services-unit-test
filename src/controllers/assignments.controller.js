const express = require('express');
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const { AssignmentCreateValidation } = require('../validator/assignments/assignment-create.validator');
const { AssignmentUpdateAnyField } = require('../validator/assignments/assignment.validator');
const { getSignedUrl } = require('../services/s3.service');
const assignmentDto = require(path.resolve(`${__dir}/src/dto/assignments.dto`));
const { TrackTypeEnum } = require('../constants/forms/track-type.constants');
const { LoggerServices } = require('../logger');
const { ErrorSetOfAssignment } = require('../constants/error-sets');
const { checkSrcVoiceFIleService, subStringForEmail, subStringForAgentNumber, dynamicSort, shuffleArray } = require(path.resolve(
  `${__dir}/src/utilities`,
));

const serviceName = 'assignments';

const AssignmentController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    assignmentRepository,
    criteriaQaCsRepository,
    groupRepository,
    agentRepository,
    auditlogRepository,
    evaluateRepository,
    attachmentRepository,
    badAnalysisFormRepository,
    criteriaKycRepository,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const { assignStartDate, assignEndDate } = req.query;
      let filter = { ...req.query };
      logger.debug('get-list-assignment', { query: req.query });
      if (assignStartDate || assignEndDate) {
        let assignmentDateTime = {};
        if (assignStartDate) {
          delete req.query.assignStartDate;
          assignmentDateTime['$gt'] = assignStartDate;
        }
        if (assignEndDate) {
          delete req.query.assignEndDate;
          assignmentDateTime['$lt'] = assignEndDate;
        }
        filter = {
          ...req.query,
          assignmentDateTime,
        };
      }
      const listOfAssignments = await assignmentRepository.getListByFilter(filter);
      logger.debug('response data', { length: listOfAssignments.length, sample: listOfAssignments.slice(0, 2) });
      res.status(200).json(listOfAssignments);
      logger.info(`get-list-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:assignmentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-assignment', { params: req.params });
      const assignmentId = req.params.assignmentId;
      const assignmentData = await assignmentRepository.getOneWithFilter({ _id: assignmentId });
      logger.debug('assignment data', assignmentData);
      if (!assignmentData) {
        logger.error(`get-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_04);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_04);
      }
      const { trackType, formId } = assignmentData;
      logger.debug('filter assignment', { trackType, formId });
      let formData = {};
      switch (trackType) {
        case TrackTypeEnum.BAD_ANALYSIS:
          formData = await badAnalysisFormRepository.getOneByFilter({ _id: formId });
          break;
        case TrackTypeEnum.KYC:
          formData = await criteriaKycRepository.getOneByFilter({ _id: formId });
          break;
        case TrackTypeEnum.QA_CS:
          formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
          break;
        default:
          logger.error(`get from data error.`, ErrorSetOfAssignment.BIQ_ASM_10);
          return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_10);
      }
      const groupData = await groupRepository.getGroupById(assignmentData['groupId']);
      let evaluateId = '';
      let evaluateStatus = '';
      let completedDate = null;
      const evaluateData = await evaluateRepository.findOneByFilter({ assignmentId });
      if (evaluateData) {
        evaluateId = evaluateData['_id'];
        evaluateStatus = evaluateData['status'];
        completedDate = evaluateData['completedDate'];
      }
      const returnData = {
        ...assignmentData,
        evaluateId,
        evaluateStatus,
        completedDate,
        formData,
        groupData,
      };
      const { fileId } = assignmentData;
      const fileData = await attachmentRepository.getStorageFileById(fileId);
      if (fileData) {
        const signedUrl = await getSignedUrl({
          bucket: fileData['bucket'],
          key: fileData['key'],
          expire: 3600,
        });
        returnData['signeduUrl'] = signedUrl || null;
      }
      logger.debug('response data', returnData);
      res.status(200).json(returnData);
      logger.info(`get-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-assignment', { payload: req.body });
      const checkValidateData = AssignmentCreateValidation(req.body);
      if (!checkValidateData) {
        const errorObject = {
          ...ErrorSetOfAssignment.BIQ_ASM_01,
          validateErrorList: AssignmentCreateValidation.errors,
        };
        logger.error(`create-assignment validate-error.`, { debugMessage: AssignmentCreateValidation.errors });
        return res.status(400).json(errorObject);
      }
      const filterAssignment = {
        formId: req.body.formId,
        fileName: req.body.fileName,
        fileKey: req.body?.fileKey || '',
        groupId: req.body.groupId,
      };
      const isAssignmentReadyExit = await assignmentRepository.getOneWithFilter(filterAssignment);
      if (isAssignmentReadyExit) {
        logger.error(`create-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_02);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_02);
      }
      logger.debug('assignment data', isAssignmentReadyExit);
      const groupData = await groupRepository.getGroupById(req.body.groupId);
      if (!groupData) {
        logger.error(`create-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_06);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_06);
      }
      logger.debug('group data', groupData);
      const { assignmentDateTime } = req.body;
      const assignDate = assignmentDateTime
        ? moment.unix(assignmentDateTime).format('YYYY-MM-DD')
        : moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
      const dataForCreate = assignmentDto.createAssignmentDTO({ ...req.body, groupName: groupData.name, assignDate });
      logger.debug('data for create assignment', dataForCreate);
      const assignmentCreated = await assignmentRepository.create(dataForCreate);
      if (!assignmentCreated) {
        logger.error(`create-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_03);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_03);
      }
      logger.debug('assignment created', assignmentCreated);

      auditlogRepository
        .create({
          userId: assignmentCreated['qaAgentId'],
          service: 'assignment',
          action: 'assignment-created',
          properties: assignmentCreated,
        })
        .then((logCreated) => logger.debug('auditlog created', logCreated))
        .catch((error) => logger.error('create-assignment error-create-auditlog', { error }));

      const assignmentUpdated = await assignmentRepository.addTaskNumber(assignmentCreated['_id']);

      logger.debug('response data', assignmentUpdated);
      res.status(200).json(assignmentUpdated);
      logger.info(`create-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.patch('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('patch-assignment', { payload: req.body });
      const dataBody = req['body'];
      const formId = dataBody['formId'];
      const assignmentDateTime = dataBody['assignmentDateTime'];
      const arrUsers = dataBody['listQaAgent'];
      const arrFiles = dataBody['listOfFiles'];
      if (Array.isArray(arrUsers) && arrUsers.length === 0) {
        logger.error(`patch-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_12);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_12);
      }
      const arrayStatistics = [];
      const arrayForCreateAssignment = [];
      const arrCreatedAssignments = [];

      const newArrayLists = dynamicSort(arrFiles, 'size');
      logger.debug('new array list', newArrayLists);
      for (let i = 0; i < newArrayLists.length; i++) {
        let agentFilter = null;
        if (newArrayLists[i].type === 'voice') {
          switch (checkSrcVoiceFIleService(newArrayLists[i].name)) {
            case 'genesis': {
              agentFilter = { email: subStringForEmail(newArrayLists[i].name) };
              break;
            }
            case 'cloudee': {
              const agentNumber = subStringForAgentNumber(newArrayLists[i].name);
              if (!agentNumber) {
                logger.error(`patch-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_08);
                return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_08);
              }
              agentFilter = { agentNumber: agentNumber };
              break;
            }
            default: {
              logger.error(`patch-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_09);
              return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_09);
            }
          }
        } else if (newArrayLists[i].type === 'ticket') {
          agentFilter = { email: newArrayLists[i].agentEmail };
        } else {
          logger.error(`patch-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_08);
          return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_08);
        }
        const agentData = await agentRepository.getOneByFilter(agentFilter);
        if (!agentData) {
          logger.error(`patch-assignment error.`, ErrorSetOfAssignment.BIQ_ASM_07);
          return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_07);
        }
        newArrayLists[i].agentId = agentData._id;
        newArrayLists[i].agentNumber = agentData.agentNumber;
        newArrayLists[i].agentEmail = agentData.email;
      }
      const newArrUsers = shuffleArray(arrUsers);
      logger.debug('new user array list', newArrUsers);
      for (let i = 0; i < newArrUsers.length; i++) {
        const user = newArrUsers[i];
        const firstFile = newArrayLists.shift();
        arrayForCreateAssignment.push({
          ...user,
          ...firstFile,
        });
        arrayStatistics.push({
          ...user,
          sizeCount: firstFile['size'],
        });
      }

      for (let i = 0; i < newArrayLists.length; i++) {
        const file = newArrayLists[i];
        const minimumObj = arrayStatistics.reduce((prev, curr) => {
          return prev['sizeCount'] < curr['sizeCount'] ? prev : curr;
        });
        arrayForCreateAssignment.push({
          ...minimumObj,
          ...file,
        });
        const indexFounded = arrayStatistics.findIndex((obj) => obj['userId'] === minimumObj['userId']);
        arrayStatistics[indexFounded]['sizeCount'] = arrayStatistics[indexFounded]['sizeCount'] + file['size'];
      }
      for (let i = 0; i < arrayForCreateAssignment.length; i++) {
        const packet = arrayForCreateAssignment[i];
        let objDataForCreate = JSON.parse('{}');
        objDataForCreate['formId'] = formId;
        objDataForCreate['assignmentDateTime'] = assignmentDateTime;
        objDataForCreate['qaAgentId'] = packet['userId'];
        objDataForCreate['qaAgentName'] = packet['username'];
        objDataForCreate['qaAgentEmail'] = packet['email'];
        objDataForCreate['groupId'] = packet['groupId'];
        objDataForCreate['fileId'] = packet['fileId'];
        objDataForCreate['fileType'] = packet['type'];
        objDataForCreate['fileName'] = packet['name'];
        objDataForCreate['fileKey'] = packet['key'] || '';
        objDataForCreate['fileUri'] = packet['uri'];
        objDataForCreate['fileSize'] = packet['size'];
        objDataForCreate['agentId'] = packet['agentId'];
        objDataForCreate['agentNumber'] = packet['agentNumber'];
        objDataForCreate['agentEmail'] = packet['agentEmail'];
        arrCreatedAssignments.push(objDataForCreate);
      }
      logger.debug('response data', arrCreatedAssignments);
      res.status(200).json(arrCreatedAssignments);
      logger.info(`patch-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:assignmentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-assignment', { params: req.params, payload: req.body });
      const checkValidateData = AssignmentUpdateAnyField(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_05, validateErrorList: AssignmentUpdateAnyField.errors };
        logger.error('update-assignment validate-error', { ...errorObject, debugMessage: AssignmentUpdateAnyField.errors });
        return res.status(400).json(errorObject);
      }
      const assignmentId = req.params.assignmentId;
      const assignmentData = await assignmentRepository.getOneWithFilter({ _id: assignmentId });
      if (!assignmentData) {
        logger.error('update-assignment error', ErrorSetOfAssignment.BIQ_ASM_04);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_04);
      }
      logger.debug('assignment data', assignmentData);
      const dataForUpdate = assignmentDto.updateAssignmentDTO(req.body);
      logger.debug('data for update assignment', dataForUpdate);
      const assignmentUpdated = await assignmentRepository.updateAssignmentByIdWithObject(assignmentId, dataForUpdate);

      logger.debug('response data', assignmentUpdated);
      res.status(200).json(assignmentUpdated);
      logger.info(`update-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.patch('/:assignmentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-field-assignment', { params: req.params, payload: req.body });
      const { assignmentId } = req.params;
      const assignmentData = await assignmentRepository.getOneWithFilter({ _id: assignmentId });
      if (!assignmentData) {
        logger.error('update-field-assignment error', ErrorSetOfAssignment.BIQ_ASM_04);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_04);
      }

      const checkValidateData = AssignmentUpdateAnyField(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_05, validateErrorList: AssignmentUpdateAnyField.errors };
        logger.error('update-field-assignment validate-error', { ...errorObject, debugMessage: AssignmentUpdateAnyField.errors });
        return res.status(400).json(errorObject);
      }
      const dataForUpdate = req.body;
      if (dataForUpdate.status === 'completed') dataForUpdate.completedDate = new Date();
      const assignmentUpdated = await assignmentRepository.updateAssignmentByIdWithObject(assignmentId, dataForUpdate);
      logger.debug('response data', assignmentUpdated);
      res.status(200).json(assignmentUpdated);
      logger.info(`update-field-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:assignmentId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-assignment', { params: req.params });
      const { assignmentId } = req.params;
      const assignmentData = await assignmentRepository.getOneWithFilter({ _id: assignmentId });
      if (!assignmentData) {
        logger.error('delete-assignment error', ErrorSetOfAssignment.BIQ_ASM_04);
        return res.status(400).json(ErrorSetOfAssignment.BIQ_ASM_04);
      }

      logger.debug('assignment data', assignmentData);
      const assignmentRemoved = await assignmentRepository.deleteAssignmentOne(assignmentId);

      logger.debug('response data', assignmentRemoved);
      res.status(204).json(assignmentData);
      logger.info(`delete-assignment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfAssignment.BIQ_ASM_00 };
      logger.critical(ErrorSetOfAssignment.BIQ_ASM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};
module.exports = AssignmentController;
