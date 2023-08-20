const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const variancesController = require(path.resolve(`${dirname}/src/controllers/variances.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const VarianceRepository = new repositoriesDb.varianceRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
const EvaluateRepository = new repositoriesDb.evaluateRepository();
const ResultEvaluateOfCriteriaQaCsRepository = new repositoriesDb.resultEvaluateOfCriteriaQaCsRepository();
const ResultEvaluateOfCriteriaKycRepository = new repositoriesDb.resultEvaluateOfCriteriaKycRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AgentRepository = new repositoriesDb.agentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = variancesController({
  userRepository: UserRepository,
  memberRepository: MemberRepository,
  varianceRepository: VarianceRepository,
  assignmentRepository: AssignmentRepository,
  evaluateRepository: EvaluateRepository,
  resultEvaluateOfCriteriaQaCsRepository: ResultEvaluateOfCriteriaQaCsRepository,
  resultEvaluateOfCriteriaKycRepository: ResultEvaluateOfCriteriaKycRepository,
  attachmentRepository: AttachmentRepository,
  agentRepository: AgentRepository,
  auditlogRepository: AuditlogRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /', () => {
  test('return status code 200', async () => {
    jest.spyOn(await VarianceRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await VarianceRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:varianceId', () => {
  test('return status code 400, Variance not found', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:varianceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:varianceId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:varianceId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /', () => {
  const mockUser = { _id: '63dbe3a54ea1e9fd12af8195', email: 'agent04@bitkub.com' };
  const mockWrongReq = {
    evaluateId: 123456,
    _id: '63dbe3a54ea1e9fd12af8195',
    email: 'agent04@bitkub.com'
  };
  const mockReq = {
    evaluateId: '63dbe3384ea1e9fd12af8125',
  };
  test('return status code 400, Payload for create variance was wrong', async () => {
    const express = require('express');
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    // Add a middleware to set the user information
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });
    app.use('/', router);
    const response = await request(app).post('/').send(mockWrongReq);
    expect(response.statusCode).toEqual(400);
  });
  
  test('return status code 400, Evaluate not found', async () => {
    const express = require('express');
    const app = express();
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance has already exists', async () => {
    const express = require('express');
    const app = express();
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance cannot create', async () => {
    const express = require('express');
    const app = express();
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await VarianceRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    const express = require('express');
    const app = express();
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await VarianceRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:varianceId', () => {
  let mockVarianceRepositoryResponse = {
    _id: '63dbe3a54ea1e9fd12af8195',
    formId: '63da89d73cb35b764e7c381a',
    evaluateId: '63dbe3384ea1e9fd12af8125',
    assignmentId: '63dbe3334ea1e9fd12af80d1',
    taskNumber: 'TN-20230202-000080',
    assignmentRef: '213',
    trackType: 'criteria-kyc',
    agentId: '631f46ae9e44cb356be9767d',
    agentEmail: 'agent04@bitkub.com',
    agentName: '',
    agentEmployeeId: '1123134',
    groupId: '63d7da1c9df54535fc4d33a8',
    fileId: '',
    fileType: 'ticket',
    fileName: '213',
    targetScore: 100,
    qaAgentId: '63b6e493aab0c589a9b5a0bc',
    qaAgentEmail: 'roybura.b@gmail.com',
    superVisorId: '63b58af17e0a7545b8550037',
    superVisorEmail: 'super2023@bitkub.com',
    monitoringDate: 1675354936,
    netScore: null,
    monitoringTime: 1675354936,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'completed',
    result: '',
    differenceValue: null,
    completedDate: '2023-02-02T17:44:41.128Z',
    date: '2023-02-02',
    createdAt: 1675355045,
    updatedAt: 1675359881,
    __v: 0,
    results: [],
  };
  let mockQACS = {
    _id: '63dbdc704ea1e9fd12af7274',
    formId: '63dbd2ea4ea1e9fd12af56a3',
    evaluateId: '63dbd62f4ea1e9fd12af60c1',
    assignmentId: '63dbd6274ea1e9fd12af6048',
    taskNumber: 'TN-20230202-000079',
    assignmentRef: '259',
    trackType: 'criteria-qa-cs',
    agentId: '63dbd5414ea1e9fd12af5e30',
    agentEmail: 'ritzjane@gmail.com',
    agentName: 'test jane',
    agentEmployeeId: '1125999',
    groupId: '63d7da1c9df54535fc4d33a8',
    fileId: '',
    fileType: 'ticket',
    fileName: '259',
    targetScore: 100,
    qaAgentId: '63b6e493aab0c589a9b5a0bc',
    qaAgentEmail: 'roybura.b@gmail.com',
    superVisorId: '63b58af17e0a7545b8550037',
    superVisorEmail: 'super2023@bitkub.com',
    monitoringDate: 1675351599,
    netScore: null,
    monitoringTime: 1675351599,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'completed',
    result: '',
    differenceValue: 50,
    completedDate: 1675424276,
    date: '2023-02-02',
    createdAt: 1675353200,
    updatedAt: 1675424276,
    __v: 0,
  };
  let mockResultEvaluateOfCriteriaQaCsRepositoryResponse = [
    {
      _id: '63dbd65f4ea1e9fd12af60dc',
      assignmentId: '63dbd6274ea1e9fd12af6048',
      evaluateId: '63dbd62f4ea1e9fd12af60c1',
      groupId: null,
      referFrom: 'item',
      referId: '63dbd2ea4ea1e9fd12af56aa',
      referOrder: '1.1',
      referTitle: '1',
      referDetail: '12',
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 60,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'varianceResult',
          type: 'boolean',
          value: true,
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 0,
        },
      ],
      comment: '',
      completedDate: '2023-02-02T17:56:21.330Z',
      createdAt: 1675351647,
      updatedAt: 1675360581,
      __v: 0,
    },
    {
      _id: '63dbd65f4ea1e9fd12af60e7',
      assignmentId: '63dbd6274ea1e9fd12af6048',
      evaluateId: '63dbd62f4ea1e9fd12af60c1',
      groupId: null,
      referFrom: 'item',
      referId: '63dbd2ea4ea1e9fd12af56ae',
      referOrder: '1.2',
      referTitle: '2',
      referDetail: '2',
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 40,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'varianceResult',
          type: 'boolean',
          value: false,
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 0,
        },
      ],
      comment: '',
      completedDate: '2023-02-02T17:56:21.664Z',
      createdAt: 1675351647,
      updatedAt: 1675360581,
      __v: 0,
    },
  ];
  let mockKYC = {
    _id: '63dfb5e35e1fdf8ab5c30f51',
    formId: '63dcc0c1b3bbe937f4e3431b',
    evaluateId: '63dcc16eb3bbe937f4e34691',
    assignmentId: '63dcc126b3bbe937f4e34633',
    taskNumber: 'TN-20230203-000004',
    assignmentRef: '20220831_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
    trackType: 'criteria-kyc',
    agentId: '6313b2a1849e6cca2c57505f',
    agentEmail: 'agent02@bitkub.com',
    agentName: '',
    agentEmployeeId: '1123122',
    groupId: '63b72539aab0c589a9b6771c',
    fileId: '63dcc122b3bbe937f4e3462e',
    fileType: 'voice',
    fileName: '20220831_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
    targetScore: 100,
    qaAgentId: '63a32444f8006663a8a4c2f8',
    qaAgentEmail: 'qa01@bitkub.com',
    superVisorId: '63a2b7e14b61772da6126af2',
    superVisorEmail: 'admin@bitkub.com',
    monitoringDate: 1675411819,
    netScore: null,
    monitoringTime: 1675411819,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'inprogress',
    result: '',
    differenceValue: null,
    completedDate: null,
    date: '2023-02-05',
    createdAt: 1675605475,
    updatedAt: 1676838237,
    __v: 0,
  };
  let mockResultEvaluateOfCriteriaKycRepositoryResponse = {
    _id: '63dcc17eb3bbe937f4e346cf',
    criteriaKycFormId: '63dcc0c1b3bbe937f4e3431b',
    evaluateId: '63dcc16eb3bbe937f4e34691',
    groupId: null,
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
        organizationValue: 'gml',
        varianceResult: false,
        _id: '63dcc17eb3bbe937f4e346d0',
      },
      {
        questionId: '63dcc0c1b3bbe937f4e34321',
        nonFatal: false,
        weightageScore: 0,
        result: 'no',
        comments: ['tert'],
        concernIssueValue: 'test',
        organizationValue: 'gml',
        varianceResult: false,
        _id: '63dcc17eb3bbe937f4e346d1',
      },
    ],
    isVarianced: false,
    completedDate: '2023-02-03T08:10:38.761Z',
    createdAt: 1675411838,
    updatedAt: 1675411838,
    __v: 0,
  };
  test('return status code 400, Payload for update variance was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId').send({ status: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance not found', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance cannot update', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockVarianceRepositoryResponse);
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId').send({ status: 'pending' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, criteria-qa-cs', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultEvaluateOfCriteriaQaCsRepositoryResponse);
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId').send({ status: 'completed' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, criteria-kyc', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultEvaluateOfCriteriaKycRepositoryResponse);
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId').send({ status: 'completed' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:varianceId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PATCH /:varianceId', () => {
  let mockVarianceRepositoryResponse = {
    _id: '63dbe3a54ea1e9fd12af8195',
    formId: '63da89d73cb35b764e7c381a',
    evaluateId: '63dbe3384ea1e9fd12af8125',
    assignmentId: '63dbe3334ea1e9fd12af80d1',
    taskNumber: 'TN-20230202-000080',
    assignmentRef: '213',
    trackType: 'criteria-kyc',
    agentId: '631f46ae9e44cb356be9767d',
    agentEmail: 'agent04@bitkub.com',
    agentName: '',
    agentEmployeeId: '1123134',
    groupId: '63d7da1c9df54535fc4d33a8',
    fileId: '',
    fileType: 'ticket',
    fileName: '213',
    targetScore: 100,
    qaAgentId: '63b6e493aab0c589a9b5a0bc',
    qaAgentEmail: 'roybura.b@gmail.com',
    superVisorId: '63b58af17e0a7545b8550037',
    superVisorEmail: 'super2023@bitkub.com',
    monitoringDate: 1675354936,
    netScore: null,
    monitoringTime: 1675354936,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'completed',
    result: '',
    differenceValue: null,
    completedDate: '2023-02-02T17:44:41.128Z',
    date: '2023-02-02',
    createdAt: 1675355045,
    updatedAt: 1675359881,
    __v: 0,
    results: [],
  };
  let mockQACS = {
    _id: '63dbdc704ea1e9fd12af7274',
    formId: '63dbd2ea4ea1e9fd12af56a3',
    evaluateId: '63dbd62f4ea1e9fd12af60c1',
    assignmentId: '63dbd6274ea1e9fd12af6048',
    taskNumber: 'TN-20230202-000079',
    assignmentRef: '259',
    trackType: 'criteria-qa-cs',
    agentId: '63dbd5414ea1e9fd12af5e30',
    agentEmail: 'ritzjane@gmail.com',
    agentName: 'test jane',
    agentEmployeeId: '1125999',
    groupId: '63d7da1c9df54535fc4d33a8',
    fileId: '',
    fileType: 'ticket',
    fileName: '259',
    targetScore: 100,
    qaAgentId: '63b6e493aab0c589a9b5a0bc',
    qaAgentEmail: 'roybura.b@gmail.com',
    superVisorId: '63b58af17e0a7545b8550037',
    superVisorEmail: 'super2023@bitkub.com',
    monitoringDate: 1675351599,
    netScore: null,
    monitoringTime: 1675351599,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'completed',
    result: '',
    differenceValue: 50,
    completedDate: 1675424276,
    date: '2023-02-02',
    createdAt: 1675353200,
    updatedAt: 1675424276,
    __v: 0,
  };
  let mockResultEvaluateOfCriteriaQaCsRepositoryResponse = [
    {
      _id: '63dbd65f4ea1e9fd12af60dc',
      assignmentId: '63dbd6274ea1e9fd12af6048',
      evaluateId: '63dbd62f4ea1e9fd12af60c1',
      groupId: null,
      referFrom: 'item',
      referId: '63dbd2ea4ea1e9fd12af56aa',
      referOrder: '1.1',
      referTitle: '1',
      referDetail: '12',
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 60,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'varianceResult',
          type: 'boolean',
          value: true,
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 0,
        },
      ],
      comment: '',
      completedDate: '2023-02-02T17:56:21.330Z',
      createdAt: 1675351647,
      updatedAt: 1675360581,
      __v: 0,
    },
    {
      _id: '63dbd65f4ea1e9fd12af60e7',
      assignmentId: '63dbd6274ea1e9fd12af6048',
      evaluateId: '63dbd62f4ea1e9fd12af60c1',
      groupId: null,
      referFrom: 'item',
      referId: '63dbd2ea4ea1e9fd12af56ae',
      referOrder: '1.2',
      referTitle: '2',
      referDetail: '2',
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 40,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'varianceResult',
          type: 'boolean',
          value: false,
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 0,
        },
      ],
      comment: '',
      completedDate: '2023-02-02T17:56:21.664Z',
      createdAt: 1675351647,
      updatedAt: 1675360581,
      __v: 0,
    },
  ];
  let mockKYC = {
    _id: '63dfb5e35e1fdf8ab5c30f51',
    formId: '63dcc0c1b3bbe937f4e3431b',
    evaluateId: '63dcc16eb3bbe937f4e34691',
    assignmentId: '63dcc126b3bbe937f4e34633',
    taskNumber: 'TN-20230203-000004',
    assignmentRef: '20220831_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
    trackType: 'criteria-kyc',
    agentId: '6313b2a1849e6cca2c57505f',
    agentEmail: 'agent02@bitkub.com',
    agentName: '',
    agentEmployeeId: '1123122',
    groupId: '63b72539aab0c589a9b6771c',
    fileId: '63dcc122b3bbe937f4e3462e',
    fileType: 'voice',
    fileName: '20220831_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
    targetScore: 100,
    qaAgentId: '63a32444f8006663a8a4c2f8',
    qaAgentEmail: 'qa01@bitkub.com',
    superVisorId: '63a2b7e14b61772da6126af2',
    superVisorEmail: 'admin@bitkub.com',
    monitoringDate: 1675411819,
    netScore: null,
    monitoringTime: 1675411819,
    areaOfStrength: '',
    areaOfImprovement: '',
    note: '',
    internalNote: '',
    isDispute: false,
    status: 'inprogress',
    result: '',
    differenceValue: null,
    completedDate: null,
    date: '2023-02-05',
    createdAt: 1675605475,
    updatedAt: 1676838237,
    __v: 0,
  };
  let mockResultEvaluateOfCriteriaKycRepositoryResponse = {
    _id: '63dcc17eb3bbe937f4e346cf',
    criteriaKycFormId: '63dcc0c1b3bbe937f4e3431b',
    evaluateId: '63dcc16eb3bbe937f4e34691',
    groupId: null,
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
        organizationValue: 'gml',
        varianceResult: false,
        _id: '63dcc17eb3bbe937f4e346d0',
      },
      {
        questionId: '63dcc0c1b3bbe937f4e34321',
        nonFatal: false,
        weightageScore: 0,
        result: 'no',
        comments: ['tert'],
        concernIssueValue: 'test',
        organizationValue: 'gml',
        varianceResult: false,
        _id: '63dcc17eb3bbe937f4e346d1',
      },
    ],
    isVarianced: false,
    completedDate: '2023-02-03T08:10:38.761Z',
    createdAt: 1675411838,
    updatedAt: 1675411838,
    __v: 0,
  };
  test('return status code 400, Payload for update variance was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId').send({ status: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance not found', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Variance cannot update', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockVarianceRepositoryResponse);
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId').send({ status: 'pending' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, criteria-qa-cs', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultEvaluateOfCriteriaQaCsRepositoryResponse);
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId').send({ status: 'completed' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, criteria-kyc', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultEvaluateOfCriteriaKycRepositoryResponse);
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId').send({ status: 'completed' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:varianceId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:varianceId', () => {
  test('return status code 400, Variance not found', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:varianceId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await VarianceRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:varianceId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await VarianceRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:varianceId');
    expect(response.statusCode).toEqual(500);
  });
});
