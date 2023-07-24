const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const templateController = require(path.resolve(`${dirname}/src/controllers/templates.controller.js`));
const TemplateRepository = new repositoriesDb.templateRepository();
const TemplateQuestionRepository = new repositoriesDb.templateQuestionRepository();
const TemplateItemRepository = new repositoriesDb.templateItemRepository();
const BadAnalysisFormRepository = new repositoriesDb.badAnalysisFormRepository();
const CriteriaKycRepository = new repositoriesDb.criteriaKycRepository();
const ResultEvaluateOfBadAnalysisRepository = new repositoriesDb.resultEvaluateOfBadAnalysisRepository();
const ResultEvaluateOfCriteriaKycRepository = new repositoriesDb.resultEvaluateOfCriteriaKycRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();

const reportOfBadAnalysisModel = require(path.resolve(`${dirname}/src/databases/models/reports/bad-analysis-report.model`));

let router = templateController({
  templateRepository: TemplateRepository,
  templateQuestionRepository: TemplateQuestionRepository,
  templateItemRepository: TemplateItemRepository,
  auditlogRepository: AuditlogRepository,
  badAnalysisFormRepository: BadAnalysisFormRepository,
  criteriaKycRepository: CriteriaKycRepository,
  resultEvaluateOfBadAnalysisRepository: ResultEvaluateOfBadAnalysisRepository,
  resultEvaluateOfCriteriaKycRepository: ResultEvaluateOfCriteriaKycRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /', () => {
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:templateId', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /', () => {
  let mockReq = {
    title: 'KYC form',
    targetScore: 100,
    tag: 'criteria-kyc',
  };
  test('return status code 400, Payload for template was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:templateId', () => {
  test('return status code 400, Payload for template was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Payload for template was wrong', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:templateId/questions', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:templateId/questions', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:templateId/questions/:questionId', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:templateId/questions/:questionId', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'delete').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:templateId/questions/:questionId/items', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions/:questionId/items').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:templateId/questions/:questionId/items', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions/:questionId/items').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:templateId/questions/:questionId/items');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:templateId/questions/:questionId/items/:itemId', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId/items/:itemId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Item of question template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:templateId/questions/:questionId/items/:itemId', () => {
  test('return status code 400, Template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId/items/:itemId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Item of question template not found', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TemplateItemRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await TemplateRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:templateId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/bad-analysis', () => {
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/bad-analysis/:badAnalysisId', () => {
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /static-form/bad-analysis', () => {
  let mockReq = {
    trackType: 'bad-analysis',
    name: 'Bad Analysis form check create duplication choice',
    targetScore: 0,
    channelOfBad: [
      {
        choiceName: 'channel 1',
        order: 1,
        //_id: '6389d43b652bc790b719f585',
      },
      {
        choiceName: 'channel 2',
        order: 2,
        //_id: '6389d43b652bc790b719f586',
      },
    ],
    reasonForBad: [
      {
        choiceName: 'reason of bad 1',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            //_id: '6389d43b652bc790b719f588',
          },
          {
            value: 'issue 2',
            order: 2,
            //_id: '6389d43b652bc790b719f589',
          },
        ],
        order: 1,
        //_id: '6389d43b652bc790b719f587',
      },
      {
        choiceName: 'reason of bad 2',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            //_id: '6389d43b652bc790b719f58b',
          },
          {
            value: 'issue 2',
            order: 2,
            //_id: '6389d43b652bc790b719f58c',
          },
        ],
        order: 2,
        //_id: '6389d43b652bc790b719f58a',
      },
      {
        choiceName: 'test 2',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            //_id: '6389d43b652bc790b719f58e',
          },
          {
            value: 'issue 2',
            order: 2,
            //_id: '6389d43b652bc790b719f58f',
          },
        ],
        order: 3,
        //_id: '6389d43b652bc790b719f58d',
      },
    ],
    issueForBad: [
      {
        choiceName: 'issue 1',
        order: 1,
        //_id: '6389d43b652bc790b719f593',
      },
      {
        choiceName: 'issue 2',
        order: 2,
        //_id: '6389d43b652bc790b719f594',
      },
    ],
    organizationOfBad: [
      {
        choiceName: 'organization 1',
        order: 1,
        //_id: '6389d43b652bc790b719f595',
      },
      {
        choiceName: 'organization 2',
        order: 2,
        //_id: '6389d43b652bc790b719f596',
      },
    ],
  };
  test('return status code 400, Payload for create form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when checkDuplicate is true', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    jest.spyOn(await BadAnalysisFormRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    jest.spyOn(await BadAnalysisFormRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /static-form/bad-analysis/:badAnalysisId', () => {
  let mockReq = {
    name: 'Bad Analysis form check create duplication choice',
    targetScore: 0,
    channelOfBad: [
      {
        choiceName: 'channel 1',
        order: 1,
        _id: '6389d43b652bc790b719f585',
      },
      {
        choiceName: 'channel 2',
        order: 2,
        _id: '6389d43b652bc790b719f586',
      },
    ],
    reasonForBad: [
      {
        choiceName: 'reason of bad 1',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            _id: '6389d43b652bc790b719f588',
          },
          {
            value: 'issue 2',
            order: 2,
            _id: '6389d43b652bc790b719f589',
          },
        ],
        order: 1,
        _id: '6389d43b652bc790b719f587',
      },
      {
        choiceName: 'reason of bad 2',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            _id: '6389d43b652bc790b719f58b',
          },
          {
            value: 'issue 2',
            order: 2,
            _id: '6389d43b652bc790b719f58c',
          },
        ],
        order: 2,
        _id: '6389d43b652bc790b719f58a',
      },
      {
        choiceName: 'test 2',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            _id: '6389d43b652bc790b719f58e',
          },
          {
            value: 'issue 2',
            order: 2,
            _id: '6389d43b652bc790b719f58f',
          },
        ],
        order: 3,
        _id: '6389d43b652bc790b719f58d',
      },
      {
        choiceName: 'test 1',
        issues: [
          {
            value: 'issue 1',
            order: 1,
            _id: '6389d43b652bc790b719f591',
          },
          {
            value: 'issue 2',
            order: 2,
            _id: '6389d43b652bc790b719f592',
          },
        ],
        order: 4,
        _id: '6389d43b652bc790b719f590',
      },
    ],
    issueForBad: [
      {
        choiceName: 'issue 1',
        order: 1,
        _id: '6389d43b652bc790b719f593',
      },
      {
        choiceName: 'issue 2',
        order: 2,
        _id: '6389d43b652bc790b719f594',
      },
    ],
    organizationOfBad: [
      {
        choiceName: 'organization 1',
        order: 1,
        _id: '6389d43b652bc790b719f595',
      },
      {
        choiceName: 'organization 2',
        order: 2,
        _id: '6389d43b652bc790b719f596',
      },
    ],
    actived: true,
  };
  test('return status code 400, Payload for update form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form can not update', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await BadAnalysisFormRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await BadAnalysisFormRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PATCH /static-form/bad-analysis/:badAnalysisId', () => {
  test('return status code 400, Payload for update form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/bad-analysis/:badAnalysisId').send({ actived: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form can not update', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await BadAnalysisFormRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await BadAnalysisFormRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /static-form/bad-analysis/:badAnalysisId', () => {
  test('return status code 400, Payload for update form was wrong', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await BadAnalysisFormRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/bad-analysis/:badAnalysisId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/bad-analysis/:badAnalysisId/result', () => {
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId/result');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId/result');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/bad-analysis/:badAnalysisId/result');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /static-form/bad-analysis/:badAnalysisId/result', () => {
  let mockReq = {
    evaluateId: '63c1110f4c9448715f9c85b9',
    qaAgentId: '63a32444f8006663a8a4c2f8',
    groupId: '63b72539aab0c589a9b6771c',
    trackType: 'trackType',
    formId: 'formId',
    groupName: 'jjjj',
    qaAgentName: 'qaAgentName',
    qaAgentEmail: 'qaAgentEmail',
    targetScore: 95,
    channelOfBad: {
      referId: '63b5d5f6aab0c589a9b44161',
      choiceName: 'Test2',
      order: 1,
    },
    reasonForBad: {
      referId: '63b5d5f6aab0c589a9b44162',
      choiceName: 'Test',
      issues: {
        referId: '63b5d5f6aab0c589a9b44163',
        value: 'issue1',
        order: 1,
        _id: '63b5d5f6aab0c589a9b44163',
      },
      order: 1,
    },
    issueForBad: {
      referId: '63b5d5f6aab0c589a9b44165',
      choiceName: 'Test',
      order: 1,
    },
    organizationOfBad: {
      referId: '63b5d5f6aab0c589a9b44166',
      choiceName: 'Test',
      order: 1,
    },
    suggestionForBad: 'fffff',
    result: 'postitive',
  };
  test('return status code 400, Payload for update form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis/:badAnalysisId/result');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis/:badAnalysisId/result').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    const mockFindOne = jest.spyOn(reportOfBadAnalysisModel, 'findOne').mockResolvedValue(null);
    const mockCreate = jest.spyOn(reportOfBadAnalysisModel, 'create').mockResolvedValue('Success');

    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis/:badAnalysisId/result').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/bad-analysis/:badAnalysisId/result').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /static-form/bad-analysis/:badAnalysisId/result/:resultId', () => {
  test('return status code 400, Payload for update form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId/result/:resultId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, bad analysis form not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId/result/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, result of bad analysis not found', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId/result/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId/result/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/bad-analysis/:badAnalysisId/result/:resultId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/criteria-kyc', () => {
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/criteria-kyc/:formKycId', () => {
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /static-form/criteria-kyc', () => {
  let mockReq = {
    name: 'Criteria-KYC - Default form  test 17/02/66',
    targetScore: 100,
    concernIssues: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ],
    listQuestions: [
      {
        order: 1,
        title: '12321321',
        detail: '65654545',
        nonFatal: false,
        weight: 60,
        listItems: [
          {
            order: 1,
            detail: '121',
            title: '121',
          },
        ],
      },
      {
        order: 2,
        title: '654546',
        detail: '654546',
        nonFatal: false,
        weight: 40,
        listItems: [
          {
            order: 1,
            detail: '45465',
            title: '45465',
          },
          {
            order: 2,
            detail: 'dfdfdfd',
            title: 'dfdfdfd',
          },
        ],
      },
    ],
    errorTypes: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ],
    futherExplanations: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ]

    /* organizations: [
      {
        value: 'Bitkub',
        order: 1,
      },
      {
        value: 'Vendor',
        order: 2,
      },
    ], */
  };
  test('return status code 400, Payload for create form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    jest.spyOn(await CriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    jest.spyOn(await CriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /static-form/criteria-kyc/:formKycId', () => {
  let mockReq = {
    name: 'Criteria-KYC - Default form  test 17/02/66',
    targetScore: 100,
    actived: true,
    concernIssues: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ],
    listQuestions: [
      {
        order: 1,
        title: '12321321',
        detail: '65654545',
        nonFatal: false,
        weight: 60,
        listItems: [
          {
            order: 1,
            detail: '121',
            title: '121',
          },
        ],
      },
      {
        order: 2,
        title: '654546',
        detail: '654546',
        nonFatal: false,
        weight: 40,
        listItems: [
          {
            order: 1,
            detail: '45465',
            title: '45465',
          },
          {
            order: 2,
            detail: 'dfdfdfd',
            title: 'dfdfdfd',
          },
        ],
      },
    ],
    errorTypes: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ],
    futherExplanations: [
      {
        value: 'test',
        order: 1,
      },
      {
        value: 'test 2',
        order: 2,
      },
      {
        value: 'test add',
        order: 3,
      },
      {
        value: 'test 5',
        order: 4,
      },
    ]
  };
  
  test('return status code 400, Payload for create form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:formKycId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaKycRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:formKycId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:formKycId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PATCH /static-form/criteria-kyc/:formKycId', () => {
  test('return status code 400, Payload for create form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/criteria-kyc/:formKycId').send({ actived: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaKycRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /static-form/criteria-kyc/:formKycId', () => {
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaKycRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/static-form/criteria-kyc/:formKycId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /static-form/criteria-kyc/:criteriaKycFormId/results', () => {
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:criteriaKycFormId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:criteriaKycFormId/results');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/static-form/criteria-kyc/:criteriaKycFormId/results');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /static-form/criteria-kyc/:criteriaKycFormId/results', () => {
  let mockReq = {
    evaluateId: '63dcc16eb3bbe937f4e34691',
    totalWeight: 100,
    netScore: 34,
    areaOfStrength: '',
    areaOfImprovement: '',
    listQuestions: [
      {
        questionId: '63dcc0c1b3bbe937f4e3431e',
        nonFatal: false,
        weightageScore: 34,
        result: 'yes',
        comments: [],
        concernIssueValue: 'test',
        errorTypeValue: '',
        futherExplanationValue: '',
        qaNoteValue: '',
        varianceResult: true,
        supQaComment: ''
      },
      {
        questionId: '63dcc0c1b3bbe937f4e34321',
        nonFatal: false,
        weightageScore: 0,
        result: 'no',
        comments: ['tert'],
        concernIssueValue: 'test',
        errorTypeValue: '',
        futherExplanationValue: '',
        qaNoteValue: '',
        varianceResult: true,
        supQaComment: ''
      },
    ],
  };
  test('return status code 400, Payload for create form was wrong', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc/:criteriaKycFormId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc/:criteriaKycFormId/results').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc/:criteriaKycFormId/results').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/static-form/criteria-kyc/:criteriaKycFormId/results').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /static-form/criteria-kyc/:criteriaKycFormId/results/:resultId', () => {
  test('return status code 400, Payload for create form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId').send({ totalWeight: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, criteria kyc form not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, result of criteria kyc not found', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Template internal server error', async () => {
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/static-form/criteria-kyc/:criteriaKycFormId/results/:resultId');
    expect(response.statusCode).toEqual(500);
  });
});
