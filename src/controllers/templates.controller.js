const express = require('express');
const __dir = require('app-root-path');
const path = require('path');
const {
  createBadAnalysisFormValidator,
  updateAllBadAnalysisFormValidator,
  updateSomeFieldBadAnalysisFormValidator,
} = require('../validator/templates/forms/bad-analysis-form.validator');
const {
  createResultOfBadAnalysisFormValidator,
  updateResultOfBadAnalysisFormValidator,
} = require('../validator/templates/forms/result-of-bad-analysis.validator');
const ReportOfBadAnalysisUseCase = require('../applications/reports/bad-analysis-report.usecase');
const {
  createCriteriaKycFormValidator,
  updateAllCriteriaKycFormValidator,
  updateSomeFieldCriteriaKycFormValidator,
} = require('../validator/templates/forms/criteria-kyc-form.validator');
const { ErrorSetOfTemplate } = require('../constants/error-sets');
const {
  createResultOfCriteriaKycValidator,
  updateResultOfCriteriaKycValidator,
} = require('../validator/templates/forms/result-of-criteria-kyc.validator');
const { CreateTemplateValidator, UpdateTemplateValidator } = require('../validator/templates/templates.validator');
const { LoggerServices } = require('../logger');
const templateDto = require(path.resolve(`${__dir}/src/dto/templates.dto`));

const serviceName = 'templates';
const TemplateController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const {
    templateRepository,
    templateQuestionRepository,
    templateItemRepository,
    badAnalysisFormRepository,
    resultEvaluateOfBadAnalysisRepository,
    criteriaKycRepository,
    resultEvaluateOfCriteriaKycRepository,
  } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-templates', { query: req.query });
      const listOfTemplates = await templateRepository.getListByFilter(req.query);
      logger.debug('response data', { length: listOfTemplates.length, sample: listOfTemplates.slice(0, 2) });
      logger.info('get-list-templates completed.');
      return res.status(200).json(listOfTemplates);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:templateId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-template', { params: req.params });
      const { templateId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('get-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }

      logger.debug('response data', templateData);
      logger.info('get-template completed.');
      return res.status(200).json(templateData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-template', { payload: req.body });
      const checkValidateData = CreateTemplateValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_01, validateErrorList: CreateTemplateValidator.errors };
        logger.error('create-template validate-error', { ...errorObject, debugMessage: CreateTemplateValidator.errors });
        return res.status(400).json(errorObject);
      }
      const formCreated = await templateRepository.create(req.body);

      logger.debug('response data', formCreated);
      logger.info('create-template completed.');
      return res.status(200).json(formCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:templateId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-template', { params: req.params, payload: req.body });
      const checkValidateData = UpdateTemplateValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_01, validateErrorList: UpdateTemplateValidator.errors };
        logger.error('update-template validate-error', { ...errorObject, debugMessage: UpdateTemplateValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { templateId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('update-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const dataForUpdate = templateDto.updateTemplateDTO(req.body);
      logger.debug('data for update template', dataForUpdate);
      const templateUpdated = await templateRepository.update(templateId, dataForUpdate);

      logger.debug('response data', templateUpdated);
      logger.info('update-template completed.');
      return res.status(200).json(templateUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:templateId/questions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-questions-of-template', { params: req.params, query: req.query });
      const { templateId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('get-list-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const filter = {
        ...req.query,
        templateId,
      };
      const listOfQuestion = await templateQuestionRepository.getListByFilter(filter);

      logger.debug('response data', { length: listOfQuestion.length, sample: listOfQuestion.slice(0, 2) });
      logger.info('get-list-questions-of-template completed.');
      return res.status(200).json(listOfQuestion);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:templateId/questions', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-questions-of-template', { params: req.params, payload: req.body });
      const { templateId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('create-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const bodyData = {
        ...req.body,
        templateId,
      };
      const dataForCreateQuestionOfTemplate = templateDto.createQuestionOfTemplateDTO(bodyData);
      logger.debug('data for create question of template', dataForCreateQuestionOfTemplate);
      const listOfQuestion = await templateQuestionRepository.create(dataForCreateQuestionOfTemplate);

      logger.debug('response data', { length: listOfQuestion.length, sample: listOfQuestion.slice(0, 2) });
      logger.info('create-questions-of-template completed.');
      return res.status(200).json(listOfQuestion);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:templateId/questions/:questionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-questions-of-template', { params: req.params, payload: req.body });
      const { templateId, questionId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('update-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId });
      if (!questionData) {
        logger.error('update-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const dataForUpdateQuestionOfTemplate = templateDto.updateQuestionOfTemplateDTO(req.body);
      logger.debug('data for update question of template', dataForUpdateQuestionOfTemplate);
      const questionUpdated = await templateQuestionRepository.update(questionId, dataForUpdateQuestionOfTemplate);

      logger.debug('response data', questionUpdated);
      logger.info('update-questions-of-template completed.');
      return res.status(200).json(questionUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:templateId/questions/:questionId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-questions-of-template', { params: req.params });
      const { templateId, questionId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('delete-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId, templateId });
      if (!questionData) {
        logger.error('delete-questions-of-template error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const questionUpdated = await templateQuestionRepository.delete(questionId);
      logger.info('delete-questions-of-template completed.');
      return res.status(200).json(questionUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:templateId/questions/:questionId/items', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-items-of-question', { params: req.params, query: req.query });
      const { templateId, questionId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('get-list-items-of-question error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId, templateId });
      if (!questionData) {
        logger.error('get-list-items-of-question error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const filter = {
        ...req.query,
        templateId,
        questionId,
      };
      const listOfItemTemplates = await templateItemRepository.getListByFilter(filter);

      logger.debug('response data', { length: listOfItemTemplates.length, sample: listOfItemTemplates.slice(0, 2) });
      logger.info('get-list-items-of-question completed.');
      return res.status(200).json(listOfItemTemplates);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/:templateId/questions/:questionId/items', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-item-of-question', { params: req.params, payload: req.body });
      const { templateId, questionId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('create-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId, templateId });
      if (!questionData) {
        logger.error('create-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const bodyData = { ...req.body, templateId, questionId };
      const dataForCreateItemOfTemplate = templateDto.createItemOfTemplateDTO(bodyData);
      logger.debug('data for create item of question template', dataForCreateItemOfTemplate);

      const itemOfQuestionTemplateCreated = await templateItemRepository.create(dataForCreateItemOfTemplate);
      logger.info('create-item-of-question completed.');
      return res.status(200).json(itemOfQuestionTemplateCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/:templateId/questions/:questionId/items/:itemId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-item-of-question', { params: req.params, payload: req.body });
      const { templateId, questionId, itemId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('update-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId, templateId });
      if (!questionData) {
        logger.error('update-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const itemData = await templateItemRepository.getOneByFilter({ _id: itemId, questionId, templateId });
      if (!itemData) {
        logger.error('update-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_04);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_04);
      }
      const dataForUpdateItemOfTemplate = templateDto.updateItemOfTemplateDTO({ ...req.body });
      logger.debug('data for update item of question template', dataForUpdateItemOfTemplate);

      const itemOfQuestionTemplateUpdated = await templateItemRepository.update(itemId, dataForUpdateItemOfTemplate);
      logger.info('update-item-of-question completed.');
      return res.status(200).json(itemOfQuestionTemplateUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:templateId/questions/:questionId/items/:itemId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-item-of-question', { params: req.params });
      const { templateId, questionId, itemId } = req.params;
      const templateData = await templateRepository.getOneByFilter({ _id: templateId });
      if (!templateData) {
        logger.error('delete-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_02);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_02);
      }
      const questionData = await templateQuestionRepository.getOneByFilter({ _id: questionId, templateId });
      if (!questionData) {
        logger.error('delete-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_03);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_03);
      }
      const itemData = await templateItemRepository.getOneByFilter({ _id: itemId, questionId, templateId });
      if (!itemData) {
        logger.error('delete-item-of-question error', ErrorSetOfTemplate.BIQ_TPM_04);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_04);
      }
      const itemRemoved = await templateItemRepository.removeItem(templateId, questionId, itemId);
      logger.info('delete-item-of-question completed.');
      return res.status(200).json(itemRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/bad-analysis', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-bad-analysis-form', { query: req.query });
      const badAnalysisFormLists = await badAnalysisFormRepository.getListByFilter(req.query);

      logger.debug('response data', { length: badAnalysisFormLists.length, sample: badAnalysisFormLists.slice(0, 2) });
      logger.info('get-list-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormLists);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/bad-analysis/:badAnalysisId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-bad-analysis-form', { params: req.params });
      const { badAnalysisId } = req.params;
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('get-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }

      logger.debug('response data', badAnalysisFormData);
      logger.info('get-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/static-form/bad-analysis', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-bad-analysis-form', { payload: req.body });
      const checkValidateData = createBadAnalysisFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: createBadAnalysisFormValidator.errors };
        logger.error('create-bad-analysis-form validate-error', { ...errorObject, debugMessage: createBadAnalysisFormValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { name: FormName } = req.body;
      const checkDuplicate = await badAnalysisFormRepository.getOneByFilter({ name: FormName });
      if (checkDuplicate) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_13 };
        logger.error('create-bad-analysis-form validate-error', { ...errorObject });
        return res.status(400).json(errorObject);
      }
      const badAnalysisFormCreated = await badAnalysisFormRepository.create({ ...req.body });
      logger.debug('response data', badAnalysisFormCreated);
      logger.info('create-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/static-form/bad-analysis/:badAnalysisId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-bad-analysis-form', { params: req.params, payload: req.body });
      const { badAnalysisId } = req.params;
      const checkValidateData = updateAllBadAnalysisFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_06, validateErrorList: updateAllBadAnalysisFormValidator.errors };
        logger.error('update-bad-analysis-form validate-error', { ...errorObject, debugMessage: updateAllBadAnalysisFormValidator.errors });
        return res.status(400).json(errorObject);
      }
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('update-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const badAnalysisFormUpdateAll = await badAnalysisFormRepository.update(badAnalysisId, req.body);
      if (!badAnalysisFormUpdateAll) {
        logger.error('update-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_08);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_08);
      }

      logger.debug('response data', badAnalysisFormUpdateAll);
      logger.info('update-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormUpdateAll);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.patch('/static-form/bad-analysis/:badAnalysisId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-field-bad-analysis-form', { params: req.params, payload: req.body });
      const { badAnalysisId } = req.params;
      const checkValidateData = updateSomeFieldBadAnalysisFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_06, validateErrorList: updateSomeFieldBadAnalysisFormValidator.errors };
        logger.error('update-field-bad-analysis-form validate-error', {
          ...errorObject,
          debugMessage: updateSomeFieldBadAnalysisFormValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('update-field-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const badAnalysisFormUpdateSomeField = await badAnalysisFormRepository.update(badAnalysisId, req.body);
      if (!badAnalysisFormUpdateSomeField) {
        logger.error('update-field-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_08);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_08);
      }

      logger.debug('response data', badAnalysisFormUpdateSomeField);
      logger.info('update-field-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormUpdateSomeField);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/static-form/bad-analysis/:badAnalysisId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-bad-analysis-form', { params: req.params });
      const { badAnalysisId } = req.params;
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('delete-bad-analysis-form error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const badAnalysisFormRemoved = await badAnalysisFormRepository.removeItem(badAnalysisId);

      logger.debug('response data', badAnalysisFormRemoved);
      logger.info('delete-bad-analysis-form completed.');
      return res.status(200).json(badAnalysisFormRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/bad-analysis/:badAnalysisId/result', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-lists-result-of-bad-analysis', { params: req.params });
      const { badAnalysisId } = req.params;
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('get-lists-result-of-bad-analysis error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const resultOfBad = await resultEvaluateOfBadAnalysisRepository.getListByFilter({ badAnalysisId });
      logger.debug('response data', { length: resultOfBad.length, sample: resultOfBad.slice(0, 2) });
      logger.info('get-lists-result-of-bad-analysis completed.');
      return res.status(200).json(resultOfBad);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/static-form/bad-analysis/:badAnalysisId/result', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-result-of-bad-analysis', { params: req.params, payload: req.body });
      const { badAnalysisId } = req.params;
      const checkValidateData = createResultOfBadAnalysisFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_06, validateErrorList: createResultOfBadAnalysisFormValidator.errors };
        logger.error('create-result-of-bad-analysis validate-error', {
          ...errorObject,
          debugMessage: createResultOfBadAnalysisFormValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('create-result-of-bad-analysis error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const dataForCreate = {
        ...req.body,
        badAnalysisId,
      };
      const resultOfBadCreated = await resultEvaluateOfBadAnalysisRepository.create(dataForCreate);
      logger.debug('result of bad analysis created', resultOfBadCreated);

      const reportUseCase = new ReportOfBadAnalysisUseCase();
      const reportBadAnalysisCreated = await reportUseCase.createBadAnalysisReportData(dataForCreate);
      logger.info('create-result-of-bad-analysis completed.');
      return res.status(200).json({ ...resultOfBadCreated, reportBadAnalysisCreated });
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/static-form/bad-analysis/:badAnalysisId/result/:resultId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-result-of-bad-analysis', { params: req.params, payload: req.body });
      const { badAnalysisId, resultId } = req.params;
      const checkValidateData = updateResultOfBadAnalysisFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_06, validateErrorList: updateResultOfBadAnalysisFormValidator.errors };
        logger.error('update-result-of-bad-analysis validate-error', {
          ...errorObject,
          debugMessage: updateResultOfBadAnalysisFormValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const badAnalysisFormData = await badAnalysisFormRepository.getOneByFilter({ _id: badAnalysisId });
      if (!badAnalysisFormData) {
        logger.error('update-result-of-bad-analysis error', ErrorSetOfTemplate.BIQ_TPM_07);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_07);
      }
      const resultOfBadAnalysisData = await resultEvaluateOfBadAnalysisRepository.getOneByFilter({ _id: resultId });
      if (!resultOfBadAnalysisData) {
        logger.error('update-result-of-bad-analysis error', ErrorSetOfTemplate.BIQ_TPM_10);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_10);
      }
      const resultOfBadUpdated = await resultEvaluateOfBadAnalysisRepository.update(resultId, req.body);
      logger.info('update-result-of-bad-analysis completed.');
      return res.status(200).json(resultOfBadUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/criteria-kyc', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-of-criteria-kyc-form', { query: req.query });
      const criteriaKycLists = await criteriaKycRepository.getListByFilter(req.query);
      logger.debug('response data', { length: criteriaKycLists.length, sample: criteriaKycLists.slice(0, 2) });
      logger.info('get-list-of-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycLists);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/criteria-kyc/:formKycId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-criteria-kyc-form', { params: req.params });
      const { formKycId } = req.params;
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formKycId });
      if (!criteriaKycData) {
        logger.error('get-criteria-kyc-form error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      logger.info('get-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/static-form/criteria-kyc', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-criteria-kyc-form', { payload: req.body });
      const checkValidateData = createCriteriaKycFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: createCriteriaKycFormValidator.errors };
        logger.error('create-criteria-kyc-form validate-error', { ...errorObject, debugMessage: createCriteriaKycFormValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { name: FormName } = req.body;
      const checkDuplicate = await criteriaKycRepository.getOneByFilter({ name: FormName });
      if (checkDuplicate) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_12 };
        logger.error('create-criteria-kyc-form validate-error', { ...errorObject });
        return res.status(400).json(errorObject);
      }
      const criteriaKycCreated = await criteriaKycRepository.create({ ...req.body });
      logger.info('create-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/static-form/criteria-kyc/:formKycId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-criteria-kyc-form', { params: req.params, payload: req.body });
      const { formKycId } = req.params;
      const checkValidateData = updateAllCriteriaKycFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: updateAllCriteriaKycFormValidator.errors };
        logger.error('update-criteria-kyc-form validate-error', { ...errorObject, debugMessage: updateAllCriteriaKycFormValidator.errors });
        return res.status(400).json(errorObject);
      }
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formKycId });
      if (!criteriaKycData) {
        logger.error('update-criteria-kyc-form error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const criteriaKycUpdated = await criteriaKycRepository.update(formKycId, req.body);
      logger.info('update-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.patch('/static-form/criteria-kyc/:formKycId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-field-criteria-kyc-form', { params: req.params, payload: req.body });
      const { formKycId } = req.params;
      const checkValidateData = updateSomeFieldCriteriaKycFormValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: updateSomeFieldCriteriaKycFormValidator.errors };
        logger.error('update-field-criteria-kyc-form validate-error', {
          ...errorObject,
          debugMessage: updateSomeFieldCriteriaKycFormValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formKycId });
      if (!criteriaKycData) {
        logger.error('update-field-criteria-kyc-form error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const criteriaKycUpdated = await criteriaKycRepository.update(formKycId, req.body);
      logger.info('update-field-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/static-form/criteria-kyc/:formKycId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-criteria-kyc-form', { params: req.params });
      const { formKycId } = req.params;
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formKycId });
      if (!criteriaKycData) {
        logger.error('delete-criteria-kyc-form error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const criteriaKycRemoved = await criteriaKycRepository.removeItem(formKycId, req.body);
      logger.info('delete-criteria-kyc-form completed.');
      return res.status(200).json(criteriaKycRemoved);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/static-form/criteria-kyc/:criteriaKycFormId/results', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-lists-result-of-criteria-kyc', { params: req.params });
      const { criteriaKycFormId } = req.params;
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: criteriaKycFormId });
      if (!criteriaKycData) {
        logger.error('get-lists-result-of-criteria-kyc error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const resultLists = await resultEvaluateOfCriteriaKycRepository.getListByFilter({ criteriaKycFormId });
      logger.info('get-lists-result-of-criteria-kyc completed.');
      return res.status(200).json(resultLists);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/static-form/criteria-kyc/:criteriaKycFormId/results', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-result-of-criteria-kyc', { params: req.params, payload: req.body });
      const { criteriaKycFormId } = req.params;
      const checkValidateData = createResultOfCriteriaKycValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: createResultOfCriteriaKycValidator.errors };
        logger.error('create-result-of-criteria-kyc validate-error', {
          ...errorObject,
          debugMessage: createResultOfCriteriaKycValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: criteriaKycFormId });
      if (!criteriaKycData) {
        logger.error('create-result-of-criteria-kyc error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const dataForCreate = { ...req.body, criteriaKycFormId };
      logger.debug('create-result-of-criteria-kyc data-for-create', { dataForCreate });

      const resultCreated = await resultEvaluateOfCriteriaKycRepository.create(dataForCreate);
      logger.info('create-result-of-criteria-kyc completed.');
      return res.status(200).json(resultCreated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('update-result-of-criteria-kyc', { params: req.params, payload: req.body });
      const { criteriaKycFormId, resultId } = req.params;
      const checkValidateData = updateResultOfCriteriaKycValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_05, validateErrorList: updateResultOfCriteriaKycValidator.errors };
        logger.error('update-result-of-criteria-kyc validate-error', {
          ...errorObject,
          debugMessage: updateResultOfCriteriaKycValidator.errors,
        });
        return res.status(400).json(errorObject);
      }
      const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: criteriaKycFormId });
      if (!criteriaKycData) {
        logger.error('update-result-of-criteria-kyc error', ErrorSetOfTemplate.BIQ_TPM_09);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_09);
      }
      const resultOfCriteriaKycData = await resultEvaluateOfCriteriaKycRepository.getOneByFilter({ _id: resultId });
      if (!resultOfCriteriaKycData) {
        logger.error('update-result-of-criteria-kyc error', ErrorSetOfTemplate.BIQ_TPM_11);
        return res.status(400).json(ErrorSetOfTemplate.BIQ_TPM_11);
      }
      const resultUpdated = await resultEvaluateOfCriteriaKycRepository.update(resultId, req.body);
      logger.info('update-result-of-criteria-kyc completed.');
      return res.status(200).json(resultUpdated);
    } catch (error) {
      const errorObject = { ...ErrorSetOfTemplate.BIQ_TPM_00 };
      logger.critical(ErrorSetOfTemplate.BIQ_TPM_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = TemplateController;
