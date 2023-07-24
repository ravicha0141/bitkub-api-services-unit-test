const express = require('express');
const { CreateFormPayloadValidator } = require('../validator/forms/forms.validator');
const { CreateChoiceValidator } = require('../validator/forms/choices.validator');
const { CreateIssuesValidator } = require('../validator/forms/issues.validator');
const { CreateItemValidator } = require('../validator/forms/items.validator');
const { ErrorSetOfForm } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');

const serviceName = 'criteria-qacs-form';

const FormsController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    criteriaQaCsRepository,
    criteriaQaCsQuestionRepository,
    criteriaQaCsItemQuestionRepository,
    criteriaQaCsChoiceRepository,
    criteriaQaCsIssueRepository,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-form-criteria-qacs', { query: req.query });
      const listOfFrom = await criteriaQaCsRepository.getListByFilter(req.query);

      logger.debug('response data', { length: listOfFrom.length, sample: listOfFrom.slice(0, 2) });
      logger.info(`get-list-form-criteria-qacs completed.`);
      return res.status(200).json(listOfFrom);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-form-criteria-qacs', { payload: req.body });
      const checkValidateData = CreateFormPayloadValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfForm.BIQ_FRM_01, validateErrorList: CreateFormPayloadValidator.errors };
        logger.error('create-form-criteria-qacs validate-error', { ...errorObject, debugMessage: CreateFormPayloadValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { name } = req.body;
      const formHasReadyexits = await criteriaQaCsRepository.getOneFormWithFilter({ name });
      if (formHasReadyexits) {
        logger.error('create-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_04);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_04);
      }
      const formCreated = await criteriaQaCsRepository.createForm(req['body']);
      if (!formCreated) {
        logger.error('create-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_03);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_03);
      }
      logger.debug('response data', formCreated);
      logger.info(`create-form-criteria-qacs completed.`);
      return res.status(200).json(formCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`get-form-criteria-qacs`, { params: req.params });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form data', formData);
      const listOfQuestions = await criteriaQaCsQuestionRepository.getListOfQuestionsByFilter({ formId: formId });
      if (!listOfQuestions) {
        logger.error('get-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_07);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_07);
      }
      let arrayListItem = [];
      for (const question of listOfQuestions) {
        const listItemQuestion = await criteriaQaCsItemQuestionRepository.getListByFilter({ questionId: question._id });
        arrayListItem.push({ ...question, listItemQuestions: listItemQuestion });
      }
      logger.debug('list criteria qacs length', arrayListItem.length);
      logger.info(`get-form-criteria-qacs completed.`);
      return res.status(200).json({ ...formData, listOfQuestions: arrayListItem });
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:formId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`update-form-criteria-qacs`, { params: req.params, payload: req.body });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('update-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('criteria qacs data', formData);
      const formUpdated = await criteriaQaCsRepository.updateFormByIdWithObject(formId, req.body);
      logger.debug('response data', formUpdated);
      logger.info(`update-form-criteria-qacs completed.`);
      return res.status(200).json(formUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:formId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`delete-form-criteria-qacs`, { params: req.params });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('delete-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_07);
      }
      logger.debug('criteria qacs data', formData);
      const formRemoved = await criteriaQaCsRepository.deleteForm(formId);
      if (!formRemoved) {
        logger.error('delete-form-criteria-qacs error', ErrorSetOfForm.BIQ_FRM_08);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_08);
      }
      logger.debug('response data', formRemoved);
      logger.info(`delete-form-criteria-qacs completed.`);
      return res.status(200).json(formRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/questions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-questions-of-qacs', { params: req.params, query: req.query });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-list-questions-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const filter = {
        ...req.query,
        formId: formId,
      };
      const listOfQuestions = await criteriaQaCsQuestionRepository.getListOfQuestionsByFilter(filter);
      logger.debug('response data', { length: listOfQuestions.length, sample: listOfQuestions.slice(0, 2) });
      logger.info(`get-list-questions-of-qacs completed.`);
      return res.status(200).json(listOfQuestions);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:formId/questions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`create-questions-of-qacs`, { params: req.params, payload: req.body });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('create-questions-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const questionCreated = await criteriaQaCsQuestionRepository.createQuestionOfForm(formId, req.body);
      logger.debug('response data', questionCreated);
      logger.info(`create-questions-of-qacs completed.`);
      return res.status(200).json(questionCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:formId/questions/:questionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`update-questions-of-qacs`, { params: req.params, payload: req.body });
      const { formId, questionId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('update-questions-of-qacs', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data ', formData);
      const updatedQuestionOfForm = await criteriaQaCsQuestionRepository.updateQuestionFormByIdWithObject(questionId, req.body);
      logger.debug('response data', updatedQuestionOfForm);
      logger.info(`update-questions-of-qacs completed.`);
      return res.status(200).json(updatedQuestionOfForm);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:formId/questions/:questionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`delete-questions-of-qacs`, { params: req.params });
      const { formId, questionId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('delete-questions-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data ', formData);
      const removedQuestionOfForm = await criteriaQaCsQuestionRepository.deleteQuestionOfForm(questionId);
      logger.debug('response data', removedQuestionOfForm);
      logger.info(`delete-questions-of-qacs completed.`);
      return res.status(200).json(removedQuestionOfForm);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/questions/:questionId/items', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`get-list-items-of-qacs-question`, { params: req.params });
      const { formId, questionId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-list-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const questionDataOfForm = await criteriaQaCsQuestionRepository.getOneQuestionsWithFilter({ _id: questionId });
      if (!questionDataOfForm) {
        logger.error('get-list-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_09);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_09);
      }
      logger.debug('question of criteria qacs', questionDataOfForm);
      const listItemQuestion = await criteriaQaCsItemQuestionRepository.getListByFilter({ questionId });
      logger.debug('response data', { length: listItemQuestion.length, sample: listItemQuestion.slice(0, 2) });
      logger.info(`get-list-items-of-qacs-question completed.`);
      return res.status(200).json(listItemQuestion);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:formId/questions/:questionId/items', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`create-items-of-qacs-question`, { params: req.params, payload: req.body });
      const checkValidateData = CreateItemValidator(req.body);
      
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfForm.BIQ_FRM_11, validateErrorList: CreateItemValidator.errors };
        logger.error('create-items-of-qacs-question error', { ...errorObject, debugMessage: CreateItemValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { formId, questionId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('create-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const questionDataOfForm = await criteriaQaCsQuestionRepository.getOneQuestionsWithFilter({ _id: questionId });
      if (!questionDataOfForm) {
        logger.error('create-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_09);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_09);
      }
      logger.debug('question of criteria qacs data', questionDataOfForm);
      const createdItems = await criteriaQaCsItemQuestionRepository.create(formId, questionId, req.body);

      logger.debug('response data', createdItems);
      logger.info(`create-items-of-qacs-question completed.`);
      return res.status(200).json(createdItems);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:formId/questions/:questionId/items/:itemId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`update-items-of-qacs-question`, { params: req.params, payload: req.body });
      const { formId, questionId, itemId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('update-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const questionDataOfForm = await criteriaQaCsQuestionRepository.getOneQuestionsWithFilter({ _id: questionId });
      if (!questionDataOfForm) {
        logger.error('update-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_09);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_09);
      }
      logger.debug('question of criteria qacs data', questionDataOfForm);
      const getItemData = await criteriaQaCsItemQuestionRepository.getOneByFilter({ _id: itemId });
      if (!getItemData) {
        logger.error('update-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_10);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_10);
      }
      logger.debug('item of question criteria qacs', getItemData);
      const updateItem = await criteriaQaCsItemQuestionRepository.updateWithFilter(itemId, req.body);

      logger.debug('response data', updateItem);
      logger.info(`update-items-of-qacs-question completed.`);
      return res.status(200).json(updateItem);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:formId/questions/:questionId/items/:itemId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug(`delete-items-of-qacs-question`, { params: req.params });
      const { formId, questionId, itemId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('delete-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const questionDataOfForm = await criteriaQaCsQuestionRepository.getOneQuestionsWithFilter({ _id: questionId });
      if (!questionDataOfForm) {
        logger.error('delete-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_09);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_09);
      }
      logger.debug('question of criteria qacs data', questionDataOfForm);
      const getItemData = await criteriaQaCsItemQuestionRepository.getOneByFilter({ _id: itemId });
      if (!getItemData) {
        logger.error('delete-items-of-qacs-question error', ErrorSetOfForm.BIQ_FRM_10);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_10);
      }
      logger.debug('item of question criteria qacs', getItemData);
      const removedItemData = await criteriaQaCsItemQuestionRepository.removeItem(formId, questionId, itemId);

      logger.debug('response data', removedItemData);
      logger.info(`delete-items-of-qacs-question completed.`);
      return res.status(200).json(removedItemData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/choices', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-choices-of-qacs', { params: req.params, query: req.query });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-list-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const filter = {
        ...req.query,
        formId: formId,
      };
      const listOfQuestions = await criteriaQaCsChoiceRepository.getListByFilter(filter);
      logger.debug('response data', { length: listOfQuestions.length, sample: listOfQuestions.slice(0, 2) });
      logger.info(`get-list-choices-of-qacs completed.`);
      return res.status(200).json(listOfQuestions);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/choices/:choiceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-choices-of-qacs', { params: req.params, query: req.query });
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const filter = {
        ...req.query,
        formId: formId,
      };
      const formChoiceData = await criteriaQaCsChoiceRepository.getOneByFilter(filter);
      if (!formChoiceData) {
        logger.error('get-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('response data', formChoiceData);
      logger.info(`get-choices-of-qacs completed.`);
      return res.status(200).json(formChoiceData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:formId/choices', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-choices-of-qacs', { params: req.params, payload: req.body });
      const checkValidateData = CreateChoiceValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfForm.BIQ_FRM_12, validateErrorList: CreateChoiceValidator.errors };
        logger.error('create-choices-of-qacs validate-error', { ...errorObject, debugMessage: CreateChoiceValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { formId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('create-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const choiceFormCreated = await criteriaQaCsChoiceRepository.create(formId, req.body);

      logger.debug('response data', choiceFormCreated);
      logger.info(`create-choices-of-qacs completed.`);
      return res.status(200).json(choiceFormCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:formId/choices/:choiceId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-choices-of-qacs', { params: req.params });
      const { formId, choiceId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('delete-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const choiceFormData = await criteriaQaCsChoiceRepository.getOneByFilter({ _id: choiceId, formId });
      if (!choiceFormData) {
        logger.error('delete-choices-of-qacs error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('choice of criteria qacs data', choiceFormData);
      const choiceFormRemoved = await criteriaQaCsChoiceRepository.removeItem(choiceId);

      logger.debug('response data', choiceFormRemoved);
      logger.info(`delete-choices-of-qacs completed.`);
      return res.status(200).json(choiceFormRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/choices/:choiceId/issues', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-issues-of-qacs-choice', { params: req.params });
      const { formId, choiceId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-list-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const formChoiceData = await criteriaQaCsChoiceRepository.getOneByFilter({ formId, _id: choiceId });
      if (!formChoiceData) {
        logger.error('get-list-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('choice of criteria qacs', formChoiceData);
      const issueOfChoiceList = await criteriaQaCsIssueRepository.getListByFilter({ formId, choiceId });

      logger.debug('response data', { length: issueOfChoiceList.length, sample: issueOfChoiceList.slice(0, 2) });
      logger.info('get-list-issues-of-qacs-choice completed.');
      return res.status(200).json(issueOfChoiceList);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:formId/choices/:choiceId/issues/:issueId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-issues-of-qacs-choice', { params: req.params });
      const { formId, choiceId, issueId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('get-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const formChoiceData = await criteriaQaCsChoiceRepository.getOneByFilter({ formId, _id: choiceId });
      if (!formChoiceData) {
        logger.error('get-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('choice of criteria qacs', formChoiceData);
      const choiceOfCriteriaData = await criteriaQaCsIssueRepository.getOneByFilter({ _id: issueId });

      logger.debug('response data', choiceOfCriteriaData);
      logger.info('get-issues-of-qacs-choice completed.');
      return res.status(200).json(choiceOfCriteriaData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:formId/choices/:choiceId/issues', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-issues-of-qacs-choice', { params: req.params, payload: req.body });
      const checkValidateData = CreateIssuesValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfForm.BIQ_FRM_13, validateErrorList: CreateIssuesValidator.errors };
        logger.error('create-issues-of-qacs-choice validate-error', { ...errorObject, debugMessage: CreateIssuesValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { formId, choiceId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('create-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const formChoiceData = await criteriaQaCsChoiceRepository.getOneByFilter({ formId, _id: choiceId });
      if (!formChoiceData) {
        logger.error('create-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('choice of criteria qacs', formChoiceData);
      const issueOfChoiceCreated = await criteriaQaCsIssueRepository.create(formId, choiceId, req.body);

      logger.debug('response data', issueOfChoiceCreated);
      logger.info('create-issues-of-qacs-choice completed.');
      return res.status(200).json(issueOfChoiceCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:formId/choices/:choiceId/issues/:issueId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-issues-of-qacs-choice', { params: req.params, payload: req.body });
      const { formId, choiceId, issueId } = req.params;
      const formData = await criteriaQaCsRepository.getOneFormWithFilter({ _id: formId });
      if (!formData) {
        logger.error('delete-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_02);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_02);
      }
      logger.debug('form criteria qacs data', formData);
      const formChoiceData = await criteriaQaCsChoiceRepository.getOneByFilter({ formId, _id: choiceId });
      if (!formChoiceData) {
        logger.error('delete-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_14);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_14);
      }
      logger.debug('choice of criteria qacs', formChoiceData);
      const issueOfChoiceData = await criteriaQaCsIssueRepository.getOneByFilter({ formId, choiceId, _id: issueId });
      if (!issueOfChoiceData) {
        logger.error('delete-issues-of-qacs-choice error', ErrorSetOfForm.BIQ_FRM_15);
        return res.status(400).json(ErrorSetOfForm.BIQ_FRM_15);
      }
      logger.debug('issue of choice', issueOfChoiceData);
      const issueOfChoiceRemoved = await criteriaQaCsIssueRepository.removeItem(issueId);

      logger.debug('response data', issueOfChoiceRemoved);
      logger.info('delete-issues-of-qacs-choice completed.');
      return res.status(200).json(issueOfChoiceRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfForm.BIQ_FRM_00 };
      logger.critical(ErrorSetOfForm.BIQ_FRM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = FormsController;
