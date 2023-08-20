const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const __dir = require('app-root-path');

const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const formsController = require(path.resolve(`${__dir}/src/controllers/forms.controller.js`));
const CriteriaQaCsRepository = new repositoriesDb.criteriaQaCsRepository();
const CriteriaQaCsQuestionRepository = new repositoriesDb.criteriaQaCsQuestionRepository();
const CriteriaQaCsItemQuestionRepository = new repositoriesDb.criteriaQaCsItemQuestionRepository();
const CriteriaQaCsChoiceRepository = new repositoriesDb.criteriaQaCsChoiceRepository();
const CriteriaQaCsIssueRepository = new repositoriesDb.criteriaQaCsIssueRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const BadAnalysisFormRepository = new repositoriesDb.badAnalysisFormRepository();
const CriteriaKycRepository = new repositoriesDb.criteriaKycRepository();
let router = formsController({
  criteriaQaCsRepository: CriteriaQaCsRepository,
  criteriaQaCsQuestionRepository: CriteriaQaCsQuestionRepository,
  criteriaQaCsItemQuestionRepository: CriteriaQaCsItemQuestionRepository,
  criteriaQaCsChoiceRepository: CriteriaQaCsChoiceRepository,
  criteriaQaCsIssueRepository: CriteriaQaCsIssueRepository,
  auditlogRepository: AuditlogRepository,
  badAnalysisFormRepository: BadAnalysisFormRepository,
  criteriaKycRepository: CriteriaKycRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /', () => {
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /', () => {
  let mockReq = {
    name: 'test qa-cs-evaluation-1-1',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
  };
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, payload for create forms was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, forms ready exit', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, forms cannot create because some field was wrong', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await CriteriaQaCsRepository, 'createForm').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await CriteriaQaCsRepository, 'createForm').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  let mockItemQuestionServiceData = [
    {
      createdAt: 1672756702,
      updatedAt: null,
      _id: '6396f1d27e03e67236e141d7',
      formId: '63961ecc5721db84316c14ca',
      questionId: '6396f1d27e03e67236e141d3',
      title: 'menu 1',
      detail: 'detail 1',
      weight: 10,
      faltalNonFaltal: 'Faltal',
      __v: 0,
      order: '1.1',
    },
  ];
  let mockQuestionServicesData = [
    {
      createdAt: 1672756702,
      updatedAt: null,
      _id: '637f99505c133957a940d680',
      formId: '637f99505c133957a940d67c',
      title: 'test title',
      detail: 'detail',
      weight: null,
      __v: 0,
      order: '1',
    },
  ];
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Question of form not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getListOfQuestionsByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getListOfQuestionsByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockQuestionServicesData);
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockItemQuestionServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:formId', () => {
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsRepository, 'updateFormByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:formId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, Question of form not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, forms cannot remove because some field was wrong', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsRepository, 'deleteForm').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsRepository, 'deleteForm').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/questions', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getListOfQuestionsByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:formId/questions', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'createQuestionOfForm').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:formId/questions/:questionId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'updateQuestionFormByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:formId/questions/:questionId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'deleteQuestionOfForm').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/questions/:questionId/items', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions/:questionId/items');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, question of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions/:questionId/items');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions/:questionId/items');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/questions/:questionId/items');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:formId/questions/:questionId/items', () => {
  let mockReq = {
    title: 'Feedback/Suggestions for Bad',
    detail: '',
  };
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, payload for create item of form was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions/:questionId/items').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions/:questionId/items').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, question of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions/:questionId/items').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let mockReq = {
      title: 'Feedback/Suggestions for Bad',
      detail: '',
      order: 'string'
    };
    let response = await request(app).post('/:formId/questions/:questionId/items').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let mockReq = {
      title: 'Feedback/Suggestions for Bad',
      detail: '',
      order: 'string'
    };
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/questions/:questionId/items').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:formId/questions/:questionId/items/:itemId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, question of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'updateWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:formId/questions/:questionId/items/:itemId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, question of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getOneQuestionsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/questions/:questionId/items/:itemId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/choices', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/choices/:choiceId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:formId/choices', () => {
  let mockReq = {
    title: 'Feedback/Suggestions for Bad',
    detail: '',
  };
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, payload for create choice was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:formId/choices/:choiceId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/choices/:choiceId/issues', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:formId/choices/:choiceId/issues/:issueId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:formId/choices/:choiceId/issues', () => {
  let mockReq = {
    title: 'Feedback/Suggestions for Bad',
    detail: '',
  };
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, payload for create choice was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices/:choiceId/issues').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices/:choiceId/issues').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices/:choiceId/issues').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices/:choiceId/issues').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:formId/choices/:choiceId/issues').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:formId/choices/:choiceId/issues/:issueId', () => {
  let mockFormsServicesData = {
    __v: 0,
    _id: '637f99505c133957a940d67c',
    actived: true,
    createdAt: 1669306704,
    isDefaultForm: false,
    name: 'QA CS evaluation form test ',
    targetScore: 100,
    trackType: 'criteria-qa-cs',
    updatedAt: null,
  };
  test('return status code 400, item of question forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, choice of forms not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, issue of choice not found', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockFormsServicesData);
    });
    jest.spyOn(await CriteriaQaCsChoiceRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await CriteriaQaCsIssueRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:formId/choices/:choiceId/issues/:issueId');
    expect(response.statusCode).toEqual(500);
  });
});
