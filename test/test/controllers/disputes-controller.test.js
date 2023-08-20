const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const disputesController = require(path.resolve(`${dirname}/src/controllers/disputes.controller.js`));
const GroupRepository = new repositoriesDb.groupRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
const CriteriaQaCsRepository = new repositoriesDb.criteriaQaCsRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const DisputeRepository = new repositoriesDb.disputeRepository();
let router = disputesController({
  groupRepository: GroupRepository,
  assignmentRepository: AssignmentRepository,
  criteriaQaCsRepository: CriteriaQaCsRepository,
  auditlogRepository: AuditlogRepository,
  disputeRepository: DisputeRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET', () => {
  let mockData = [
    {
      _id: '63b74004aab0c589a9b6da52',
      formId: '63ac51d34559dd4cea931378',
      trackType: 'criteria-qa-cs',
      assignmentId: '63b73f93aab0c589a9b6d8d5',
      evaluateId: '63b73fa2aab0c589a9b6d918',
      taskNumber: 'TN-20230106-000023',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'ritzjane@gmail.com',
      groupId: '63b72539aab0c589a9b6771c',
      superVisorEmail: 'sup001@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1672938000,
      qaReason: '',
      qaReasonDate: '1970-01-01',
      disputeStatus: 'pending',
      dateOfMonitoring: '2023-01-06',
      createdAt: 1672953860,
      updatedAt: null,
      __v: 0,
      createdDateFormat: '2023-01-05T21:24:20.667Z',
    },
    {
      _id: '63d0ac5feffb956d7f2371bd',
      formId: '63bc56b6f9e16f803af7417f',
      trackType: 'criteria-qa-cs',
      assignmentId: '63d0a9fceffb956d7f23703a',
      evaluateId: '63d0aba7effb956d7f23708c',
      taskNumber: 'TN-20230125-000001',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'qa01@bitkub.com',
      groupId: '63b72539aab0c589a9b6771c',
      superVisorEmail: 'superuser001@bitkub.com',
      agentReason: 'change result',
      agentReasonDate: 1674579600,
      qaReason: 'okay brooo',
      qaReasonDate: '2023-01-25',
      disputeStatus: 'agreed',
      dateOfMonitoring: '2023-01-25',
      createdAt: 1674619999,
      updatedAt: 1674619999,
      __v: 0,
      createdDateFormat: '2022-12-25T04:13:19.861Z',
      completedDate: '2023-01-19T15:21:08.000Z',
    },
    {
      _id: '63d0ee18effb956d7f2376cd',
      formId: '63bbf8873d27d085640c7135',
      trackType: 'criteria-kyc',
      assignmentId: '63d0ec88effb956d7f2374dd',
      evaluateId: '63d0ed32effb956d7f237540',
      taskNumber: 'TN-20230125-000002',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'qa01@bitkub.com',
      groupId: '63b72539aab0c589a9b6771c',
      superVisorEmail: 'superuser001@bitkub.com',
      agentReason: 'okay ',
      agentReasonDate: 1674579600,
      qaReason: 'okay',
      qaReasonDate: '2023-01-25',
      disputeStatus: 'agreed',
      dateOfMonitoring: '2023-01-25',
      createdAt: 1674636824,
      updatedAt: 1674636824,
      __v: 0,
      createdDateFormat: '2023-01-25T08:53:44.524Z',
      completedDate: '2023-01-19T15:21:08.000Z',
    },
  ];
  test('return status code 400, filter disputes was wrong', async () => {
    jest.spyOn(await DisputeRepository, 'getListOfDisputesByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await DisputeRepository, 'getListOfDisputesByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/').query({ startDate: 1669012200, endDate: 1677309679 });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, disputes controller error something', async () => {
    jest.spyOn(await DisputeRepository, 'getListOfDisputesByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:disputeId', () => {
  test('return status code 400, disputes not found', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:disputeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockDisputeServicesData = {
      __v: 0,
      _id: '63920a9805c39ba1f4768284',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      assignmentId: '639116130f42d390e69b1e68',
      createdAt: 1670432400,
      createdDateFormat: '2022-12-07T17:00:00.000Z',
      dateOfMonitoring: 1670432400,
      disputeStatus: 'agreed',
      evaluateId: '639116190f42d390e69b1eb6',
      formId: '639115f70f42d390e69b1d63',
      groupId: '635987474b16253803502daa',
      qaAgent: 'agentqa01@bitkub.com',
      qaReason: 'testt',
      qaReasonDate: 1670518800,
      superVisorEmail: 'assisttest01@bitkub.com',
      taskNumber: 'TN-20221208-000003',
      trackType: 'criteria-kyc',
    };
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockDisputeServicesData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:disputeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, disputes controller error something', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:disputeId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST', () => {
  test('return status code 400, payload for update disputes was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, disputes not found', async () => {
    let mockReq = {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      dateOfMonitoring: 1670432400,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, disputes cannot create because some field was wrong', async () => {
    let mockAssignmentServicesData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    let mockReq = {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      dateOfMonitoring: 1670432400,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await DisputeRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockAssignmentServicesData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    let mockReq = {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      //superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      dateOfMonitoring: 1670432400,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await DisputeRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('create-dispute error-create-auditlog', async () => {
    let mockAssignmentServicesData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    let mockReq = {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      //superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      dateOfMonitoring: 1670432400,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await DisputeRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    let mockReq = {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      //superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      dateOfMonitoring: 1670432400,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:disputeId', () => {
  test('return status code 400, payload for update disputes was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId').send({ disputeStatus: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, disputes not found', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, disputes cannot create because some field was wrong', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'updateWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'updateWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId').send({ 
      superVisorEmail: 'sup001@bitkub.com',
      disputeStatus: 'agreed'
    });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'updateWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId').send({
      superVisorEmail: 'sup001@bitkub.com',
      disputeStatus: 'agreed'
    });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, disputes controller error something', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'updateWithObject').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:disputeId').send({
      superVisorEmail: 'sup001@bitkub.com'
    });
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:disputeId', () => {
  test('return status code 400, disputes not found', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:disputeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'deleteDisputeOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:disputeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, disputes controller error something', async () => {
    jest.spyOn(await DisputeRepository, 'getOneDisputeWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await DisputeRepository, 'deleteDisputeOne').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:disputeId');
    expect(response.statusCode).toEqual(500);
  });
});
