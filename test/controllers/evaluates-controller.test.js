const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const __dir = require('app-root-path');

const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const evaluatesController = require('../../src/controllers/evaluates.controller.js');
const { OnBreakTimeUseCase } = require('../../src/applications/evaluates/on-break-times.usecase.js');
const UserRepository = new repositoriesDb.userRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
const EvaluateRepository = new repositoriesDb.evaluateRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AgentRepository = new repositoriesDb.agentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const CriteriaQaCsRepository = new repositoriesDb.criteriaQaCsRepository();
const CriteriaQaCsQuestionRepository = new repositoriesDb.criteriaQaCsQuestionRepository();
const CriteriaQaCsItemQuestionRepository = new repositoriesDb.criteriaQaCsItemQuestionRepository();
const BadAnalysisFormRepository = new repositoriesDb.badAnalysisFormRepository();
const CriteriaKycRepository = new repositoriesDb.criteriaKycRepository();
const ResultEvaluateOfBadAnalysisRepository = new repositoriesDb.resultEvaluateOfBadAnalysisRepository();
const ResultEvaluateOfCriteriaQaCsRepository = new repositoriesDb.resultEvaluateOfCriteriaQaCsRepository();
const ResultEvaluateOfCriteriaKycRepository = new repositoriesDb.resultEvaluateOfCriteriaKycRepository();
const classOnBreakTimeUseCase = new OnBreakTimeUseCase();
let router = evaluatesController({
  userRepository: UserRepository,
  memberRepository: MemberRepository,
  assignmentRepository: AssignmentRepository,
  evaluateRepository: EvaluateRepository,
  attachmentRepository: AttachmentRepository,
  agentRepository: AgentRepository,
  auditlogRepository: AuditlogRepository,
  criteriaQaCsRepository: CriteriaQaCsRepository,
  criteriaQaCsQuestionRepository: CriteriaQaCsQuestionRepository,
  criteriaQaCsItemQuestionRepository: CriteriaQaCsItemQuestionRepository,
  badAnalysisFormRepository: BadAnalysisFormRepository,
  criteriaKycRepository: CriteriaKycRepository,
  resultEvaluateOfBadAnalysisRepository: ResultEvaluateOfBadAnalysisRepository,
  resultEvaluateOfCriteriaQaCsRepository: ResultEvaluateOfCriteriaQaCsRepository,
  resultEvaluateOfCriteriaKycRepository: ResultEvaluateOfCriteriaKycRepository,
  onBreakTimeUseCase: classOnBreakTimeUseCase,
});

const TIMEOUT = 1000*60*5

afterEach( () => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET', () => {
  let mockData = [
    {
      _id: '63836e52e43756188e4bc3ee',
      formId: '637f99505c133957a940d67c',
      assignmentId: '63836e47e43756188e4bc3b2',
      taskNumber: 'TN-20221127-000005',
      assignmentRef: '20220825_191327_000004_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
      trackType: 'criteria-qa-cs',
      agentId: '631f46ae9e44cb356be9767d',
      agentEmail: 'agent04@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '6346e252a352d2adfecd7d70',
      fileId: '63836e44e43756188e4bc3ad',
      fileType: 'voice',
      fileName: '20220825_191327_000004_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
      targetScore: 100,
      qaAgentId: '632b15660e7bef47a6ef9f82',
      qaAgentEmail: 'qaagent001@bitkub.com',
      monitoringDate: '2022-11-27',
      netScore: 100,
      monitoringTime: '2022-11-27',
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'completed',
      result: '',
      __v: 0,
      createdAt: 1670441644,
      date: '2022-12-08',
      completedDate: '2023-01-31T17:27:55.000Z',
      tags: {},
      fileSize: 185,
      percentage: null,
      totalWeight: null,
      onBreakTimes: [],
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/').query({ monitoringDate: '2022-11-27' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:evaluateId', () => {
  let mockEvaluateServiceData = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mcokStorageFilesServicesData = {
    __v: 0,
    _id: '630d0ef3806854eff19955a1',
    bucket: 'bitqast-dev',
    createdAt: 1671723166,
    etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
    fieldname: 'audio',
    fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    originalname: 'Test voice file small 1 copy 2.mp3',
    size: 3202408,
    sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    typeFile: 'voice-file',
    updatedAt: null,
    uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  };
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, File not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST', () => {
  let mockReq = {
    agentId: '63126994a45b9496d1b1f432',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    fileId: '',
    internalNote: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    note: '',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    status: 'completed',
    targetScore: 200,
    trackType: 'criteria-qa-cs',
  };
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
  let mockUsersDbServicesData = {
    __v: 0,
    _id: '6236b84255b3320bd1642735',
    createdAt: 1662832593,
    email: 'thapakorn613@gmail.com',
    imageId: '630240d5540c633bf2fc1f0a',
    level: 'qaAgent',
    password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
    signatureId: '630a04f3ae2bd31df3a6dd39',
    status: 'active',
    telephone: 'String',
    type: 'SSO_AUTHEN',
    updatedAt: null,
    username: 'artronin2',
  };
  let mockAgentServicesData = {
    __v: 0,
    _id: '63126994a45b9496d1b1f432',
    agentNumber: '000212',
    createdAt: 1671636605,
    email: 'minnie.thirawat@bitkub.com',
    employeeId: '111111',
    name: 'Minnie Thirawat',
    updatedAt: null,
    username: 'minnie.thirawat',
  };
  test('return status code 400, Payload for create evaluate was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Assignment not found', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Qa agent not found', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Agent not found', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, File not found', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Evaluate has ready exit', async () => {
    let mcokStorageFilesServicesData = {
      __v: 0,
      _id: '630d0ef3806854eff19955a1',
      bucket: 'bitqast-dev',
      createdAt: 1671723166,
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      fieldname: 'audio',
      fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      originalname: 'Test voice file small 1 copy 2.mp3',
      size: 3202408,
      sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      typeFile: 'voice-file',
      updatedAt: null,
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    };
    let mockEvaluateServiceData = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mcokStorageFilesServicesData = {
      __v: 0,
      _id: '630d0ef3806854eff19955a1',
      bucket: 'bitqast-dev',
      createdAt: 1671723166,
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      fieldname: 'audio',
      fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      originalname: 'Test voice file small 1 copy 2.mp3',
      size: 3202408,
      sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      typeFile: 'voice-file',
      updatedAt: null,
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    };
    let mockMemberServicesData = {
      __v: 0,
      _id: '631662a4f55f573399f8dc22',
      createdAt: 1671720365,
      email: 'bitkubagent1@bitkub.com',
      groupId: '630ceb60fdd0d440c056e3c0',
      name: 'bitkubagent3',
      role: 'qaAgent',
      updatedAt: null,
      userId: '624fe297790139ea1d6885c7',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentServicesData);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberServicesData);
    });
    jest.spyOn(await EvaluateRepository, 'create').mockImplementationOnce(async () => {
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
  test('return status code 200, create-evaluate error-create-auditlog', async () => {
    let mcokStorageFilesServicesData = {
      __v: 0,
      _id: '630d0ef3806854eff19955a1',
      bucket: 'bitqast-dev',
      createdAt: 1671723166,
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      fieldname: 'audio',
      fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      originalname: 'Test voice file small 1 copy 2.mp3',
      size: 3202408,
      sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      typeFile: 'voice-file',
      updatedAt: null,
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    };
    let mockMemberServicesData = {
      __v: 0,
      _id: '631662a4f55f573399f8dc22',
      createdAt: 1671720365,
      email: 'bitkubagent1@bitkub.com',
      groupId: '630ceb60fdd0d440c056e3c0',
      name: 'bitkubagent3',
      role: 'qaAgent',
      updatedAt: null,
      userId: '624fe297790139ea1d6885c7',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssignmentServicesData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentServicesData);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberServicesData);
    });
    jest.spyOn(await EvaluateRepository, 'create').mockImplementationOnce(async () => {
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
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:evaluateId', () => {
  let mockReq = {
    areaOfImprovement: '',
    areaOfStrength: '',
    bpo: '',
    dateOfCall: '',
    internalNote: '',
    isDispute: false,
    language: '',
    netScore: 25,
    percentage: 41.666666666666664,
    status: 'completed',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    uid: '',
  };
  let mockEvaluateServiceData = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockAuditlogServicesData = {
    __v: 0,
    _id: '637ba33e367cb01d3258bf0b',
    action: 'onduty-started',
    createdAt: 1669047102,
    date: '2022-11-21',
    properties: {
      __v: 0,
      _id: '637ba33e367cb01d3258bf08',
      amount: 0,
      date: '2022-11-21',
      endTime: 0,
      groupId: '6335a4bfa72902c5f329a82a',
      groupName: 'check member',
      qaAgentEmail: 'agent1@bitkub.com',
      qaAgentId: '62372f2229001d280317d04a',
      startTime: 1669047102,
      status: true,
      type: 'on-duty',
    },
    reason: '',
    service: 'progression',
    tag: '1',
    updatedAt: null,
    userId: '62372f2229001d280317d04a',
  };
  test('return status code 400, Payload for update evaluate was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send({ isDispute: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Result evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await EvaluateRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await AuditlogRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await EvaluateRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await AuditlogRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'findByIdAndUpdateById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('error create auditlog', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await EvaluateRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await AuditlogRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:evaluateId', () => {
  let mockEvaluateServiceData = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'bad-analysis',
    uid: '',
    updatedAt: null,
  };
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Evaluate cannot remove', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await EvaluateRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, TrackTypeEnum.QA_CS', async () => {
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await EvaluateRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve({ deletedCount: 1 });
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'deleteMany').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, TrackTypeEnum.KYC', async () => {
    let mockEvaluateServiceDataKYC = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-kyc',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await EvaluateRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve({ deletedCount: 1 });
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'removeItemMany').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, TrackTypeEnum.BAD_ANALYSIS', async () => {
    let mockEvaluateServiceDataBadAnalysis = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'bad-analysis',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await EvaluateRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve({ deletedCount: 1 });
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'removeItemMany').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:evaluateId/results', () => {
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, get-result-of-evaluate bad-analysis completed', async () => {
    let mockEvaluateServiceDataBadAnalysis = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'bad-analysis',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, get-result-of-evaluate criteria-kyc completed', async () => {
    let mockEvaluateServiceDataKYC = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-kyc',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, get-result-of-evaluate criteria-qa-cs completed', async () => {
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:evaluateId/results/:resultId', () => {
  let mockEvaluateServiceDataQACS = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataBadAnalysis = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'bad-analysis',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataKYC = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-kyc',
    uid: '',
    updatedAt: null,
  };
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Result evaluate not found criteria-qa-cs', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, criteria-qa-cs', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Result evaluate not found bad-analysis', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, bad-analysis', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Result evaluate not found criteria-kyc', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, criteria-kyc', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:evaluateId/results', () => {
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Payload for update evaluate was wrong', async () => {
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, create bad-analysis Payload for update evaluate was wrong', async () => {
    let mockEvaluateServiceDataBadAnalysis = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'bad-analysis',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, create bad-analysis', async () => {
    let mockReq = {
      //badAnalysisId: '63b5d5f6aab0c589a9b44160',
      evaluateId: '63c1110f4c9448715f9c85b9',
      qaAgentId: '63a32444f8006663a8a4c2f8',
      groupId: '63b72539aab0c589a9b6771c',
      trackType: 'bad-analysis',
      formId: '637d1ab8b839d958ccc039dd',
      qaAgentName: '',
      qaAgentEmail: 'agentqa01@bitkub.com',
      targetScore: 0,
      groupName: 'jjjj',
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
    // let mockEvaluateServiceDataBadAnalysis = {
    //   __v: 0,
    //   _id: '63a3cc2aa934f7bb58bf750d',
    //   agentEmail: 'minnie.thirawat@bitkub.com',
    //   agentEmployeeId: '',
    //   agentId: '63126994a45b9496d1b1f432',
    //   agentName: 'Minnie Thirawat',
    //   areaOfImprovement: '',
    //   areaOfStrength: '',
    //   assignmentId: '63a34dc3a934f7bb58bf6ce6',
    //   assignmentRef: '903343',
    //   bpo: '',
    //   createdAt: 1671637864,
    //   date: '2022-12-22',
    //   dateOfCall: '',
    //   fileId: '',
    //   fileName: '903343',
    //   fileSize: 1,
    //   fileType: 'voice',
    //   formId: '63961ecc5721db84316c14ca',
    //   groupId: '63a32c76a934f7bb58bf566d',
    //   internalNote: '',
    //   isDispute: false,
    //   language: '',
    //   monitoringDate: 1671679017,
    //   monitoringTime: 1671679017,
    //   netScore: 25,
    //   note: '',
    //   percentage: 41.666666666666664,
    //   qaAgentEmail: 'qaagent01@bitkub.com',
    //   qaAgentId: '63a32ee4a934f7bb58bf61eb',
    //   result: '',
    //   status: 'completed',
    //   targetScore: 200,
    //   taskNumber: 'TN-20221222-000040',
    //   timeOfCall: '00:00:00',
    //   totalWeight: 60,
    //   trackType: 'bad-analysis',
    //   uid: '',
    //   updatedAt: null,
    // };
    let mockEvaluateServiceDataBadAnalysis = {
      _id: '638841a7bc7af87cc103b7b2',
      formId: '637d1ab8b839d958ccc039dd',
      assignmentId: '63883ff7bc7af87cc103b60b',
      taskNumber: 'TN-20221201-000005',
      assignmentRef: '20211010_191327_000212_66740422550_9ff47e27_3c35_41e6_b932_fb63f2b11a12 copy 14.mp3',
      trackType: 'bad-analysis',
      agentId: '63126994a45b9496d1b1f432',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentName: 'Minnie Thirawat',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '63883fefbc7af87cc103b5e5',
      fileType: 'voice',
      fileName: '20211010_191327_000212_66740422550_9ff47e27_3c35_41e6_b932_fb63f2b11a12 copy 14.mp3',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: '2022-12-01',
      netScore: 60,
      monitoringTime: '2022-12-01',
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: 'test update internal note.',
      isDispute: false,
      status: 'on-breaking',
      result: '',
      __v: 0,
      createdAt: 1670441644,
      date: '2022-12-08',
      completedDate: '2022-12-14T02:36:42.794Z',
      tags: {},
      fileSize: 198,
      onBreakTimes: [
        {
          onBreakTimeId: '6398c9c33fd5c01a293af33a',
          startDate: '2022-12-13T17:46:36.165Z',
          endDate: '2022-12-13T17:50:13.165Z',
          amount: 13,
          archived: true,
          _id: '6398c9c33fd5c01a293af33d',
        },
        {
          onBreakTimeId: '6398d0abaa2e73aa5d4c67b2',
          startDate: '2022-12-13T17:50:00.165Z',
          endDate: '2022-12-13T17:50:13.165Z',
          amount: 13,
          archived: true,
          _id: '6398d0abaa2e73aa5d4c67b5',
        },
        {
          onBreakTimeId: '63a1a98f12980181c30f9059',
          startDate: '2022-12-13T17:50:00.165Z',
          endDate: '2022-12-20T17:50:13.165Z',
          amount: 604813,
          archived: true,
          _id: '63a1a99012980181c30f905c',
        },
        {
          onBreakTimeId: '63a1a9cd3d32b85708f891bb',
          action: 'on-break',
          startDate: '2022-12-13T17:50:00.165Z',
          endDate: null,
          amount: null,
          archived: false,
          _id: '63a1a9ce3d32b85708f891be',
        },
      ],
      percentage: null,
      totalWeight: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, create qa-cs Payload for update evaluate was wrong', async () => {
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, create qa-cs', async () => {
    let mockReq = {
      trackType: 'criteria-qa-cs',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      referDetail: '1',
      comment: '',
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Non-Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 1,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 1,
        },
      ],
    };
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-qa-cs',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, create kyc Payload for update evaluate was wrong', async () => {
    let mockEvaluateServiceDataKYC = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-kyc',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, create kyc', async () => {
    let mockReq = {
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      totalWeight: 60,
      netScore: 25,
      areaOfStrength: '',
      areaOfImprovement: '',
      listQuestions: [
        {
          questionId: 'string',
          nonFatal: true,
          weightageScore: 50,
          result: 'string',
          comments: [],
          concernIssueValue: 'string',
          errorTypeValue: 'string',
          futherExplanationValue: 'string',
          qaNoteValue: 'string',
          //organizationValue: 'string',
          varianceResult: true,
          supQaComment: 'string'
        },
      ],
    };
    let mockEvaluateServiceDataQACS = {
      __v: 0,
      _id: '63a3cc2aa934f7bb58bf750d',
      agentEmail: 'minnie.thirawat@bitkub.com',
      agentEmployeeId: '',
      agentId: '63126994a45b9496d1b1f432',
      agentName: 'Minnie Thirawat',
      areaOfImprovement: '',
      areaOfStrength: '',
      assignmentId: '63a34dc3a934f7bb58bf6ce6',
      assignmentRef: '903343',
      bpo: '',
      createdAt: 1671637864,
      date: '2022-12-22',
      dateOfCall: '',
      fileId: '',
      fileName: '903343',
      fileSize: 1,
      fileType: 'voice',
      formId: '63961ecc5721db84316c14ca',
      groupId: '63a32c76a934f7bb58bf566d',
      internalNote: '',
      isDispute: false,
      language: '',
      monitoringDate: 1671679017,
      monitoringTime: 1671679017,
      netScore: 25,
      note: '',
      percentage: 41.666666666666664,
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      result: '',
      status: 'completed',
      targetScore: 200,
      taskNumber: 'TN-20221222-000040',
      timeOfCall: '00:00:00',
      totalWeight: 60,
      trackType: 'criteria-kyc',
      uid: '',
      updatedAt: null,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Track type not found', async () => {
    let mockEvaluateServiceData = {
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      groupId: '63a32c76a934f7bb58bf566d',
      formId: '63961ecc5721db84316c14ca',
      groupName: 'groupName',
      qaAgentName: 'test',
      qaAgentEmail: 'qaagent01@bitkub.com',
      targetScore: 200,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/results');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:evaluateId/results/:resultId', () => {
  let mockEvaluateServiceDataBadAnalysis = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'bad-analysis',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataQACS = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataKYC = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-kyc',
    uid: '',
    updatedAt: null,
  };
  let mockResultsServiceData = {
    __v: 0,
    _id: '638cdd68d0d97e5384c90ac1',
    assignmentId: '638cc3529ef1ffb0fa2c4376',
    comment: '',
    completedDate: '2022-12-04T17:48:24.000Z',
    createdAt: 1671701884,
    evaluateId: '638cc3599ef1ffb0fa2c43b6',
    groupId: null,
    referDetail: '1',
    referFrom: 'item',
    referId: '6385babe36ec587b4dfe2819',
    referOrder: '1.1',
    referTitle: '1',
    updatedAt: 1670176104,
    values: [
      {
        field: 'Faltal/NonFaltal',
        type: 'text',
        value: 'Non-Faltal',
      },
      {
        field: 'Result',
        type: 'number',
        value: 1,
      },
      {
        field: 'selectType',
        type: 'text',
        value: 'yes',
      },
      {
        field: 'Weigth',
        type: 'number',
        value: 1,
      },
    ],
  };
  test('return status code 400, Evaluate not found', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, update bad-analysis Result evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Payload for update evaluate was wrong', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId').send({ targetScore: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, update bad-analysis', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, update qa-cs Result evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, update qa-cs', async () => {
    let mockResultsServiceData = {
      __v: 0,
      _id: '638cdd68d0d97e5384c90ac1',
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      comment: '',
      completedDate: '2022-12-04T17:48:24.000Z',
      createdAt: 1671701884,
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      groupId: null,
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      updatedAt: 1670176104,
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Non-Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 1,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 1,
        },
      ],
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, update kyc Result evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, update kyc Payload for update evaluate was wrong', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId').send({ totalWeight: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, update kyc', async () => {
    let mockResultsServiceData = {
      __v: 0,
      _id: '638cdd68d0d97e5384c90ac1',
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      comment: '',
      completedDate: '2022-12-04T17:48:24.000Z',
      createdAt: 1671701884,
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      groupId: null,
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      updatedAt: 1670176104,
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Non-Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 1,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 1,
        },
      ],
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 404, Track type not found', async () => {
    let mockEvaluateServiceData = {
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      groupId: '63a32c76a934f7bb58bf566d',
      formId: '63961ecc5721db84316c14ca',
      groupName: 'groupName',
      qaAgentName: 'test',
      qaAgentEmail: 'qaagent01@bitkub.com',
      targetScore: 200,
    };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:evaluateId/results/:resultId', () => {
  let mockEvaluateServiceDataBadAnalysis = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'bad-analysis',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataQACS = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataKYC = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-kyc',
    uid: '',
    updatedAt: null,
  };
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, qa-cs', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Result evaluate not found kyc', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, kyc', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Result evaluate not found bad-analysis', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, kyc', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataBadAnalysis);
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ResultEvaluateOfBadAnalysisRepository, 'removeItem').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, Track type not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:evaluateId/results/:resultId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:evaluateId/feedback', () => {
  let mockEvaluateServiceDataQACS = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockEvaluateServiceDataKYC = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-kyc',
    uid: '',
    updatedAt: null,
  };
  let mcokStorageFilesServicesData = {
    __v: 0,
    _id: '630d0ef3806854eff19955a1',
    bucket: 'bitqast-dev',
    createdAt: 1671723166,
    etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
    fieldname: 'audio',
    fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    originalname: 'Test voice file small 1 copy 2.mp3',
    size: 3202408,
    sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    typeFile: 'voice-file',
    updatedAt: null,
    uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  };
  test('return status code 400, filter disputes was wrong', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/feedback');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, File not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/feedback');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, qa-cs', async () => {
    let mockResultsServiceData = {
      _id: '638373d3e43756188e4bc914',
      formId: '637f99505c133957a940d67c',
      assignmentId: '638372cee43756188e4bc8d4',
      taskNumber: 'TN-20221127-000009',
      assignmentRef: '20220824_191327_000001_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
      trackType: 'criteria-qa-cs',
      agentId: '6313b298849e6cca2c57505c',
      agentEmail: 'agent01@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '6346e252a352d2adfecd7d70',
      fileId: '638372cbe43756188e4bc8cf',
      fileType: 'voice',
      fileName: '20220824_191327_000001_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a12.mp3',
      targetScore: 100,
      qaAgentId: '632b15660e7bef47a6ef9f82',
      qaAgentEmail: 'qaagent001@bitkub.com',
      monitoringDate: '2022-11-27',
      netScore: 100,
      monitoringTime: '2022-11-27',
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'completed',
      result: '',
      __v: 0,
      createdAt: 1670441644,
      date: '2022-12-08',
      completedDate: '2022-11-27T14:27:31.000Z',
      tags: {},
      fileSize: 198,
      percentage: null,
      totalWeight: null,
      onBreakTimes: [],
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
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataQACS);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaQaCsRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultsServiceData);
    });
    jest.spyOn(await CriteriaQaCsItemQuestionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockItemQuestionServiceData);
    });
    jest.spyOn(await CriteriaQaCsQuestionRepository, 'getListOfQuestionsByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockQuestionServicesData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/feedback');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, criteria-kyc', async () => {
    let mockCriteriaKycServiceData = {
      errorTypes: [],
      futherExplanations: [],
      _id: '63961ee9ac9613ef718acbe6',
      trackType: 'criteria-kyc',
      name: 'Criteria-KYC - Default form  test 17/02/66',
      targetScore: 100,
      concernIssues: [
        {
          value: 'test',
          order: 1,
          _id: '639729de3c2be1855e18dc71',
        },
        {
          value: 'test 2',
          order: 2,
          _id: '6397316e3c2be1855e18e5ea',
        },
        {
          value: 'test add',
          order: 3,
          _id: '639735283c2be1855e18f63d',
        },
        {
          value: 'test 5',
          order: 4,
          _id: '63b592a07e0a7545b8550d7b',
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
              detail: '',
              order: 1,
              title: '121',
              _id: '63f51f8d1323dc53a62fda8b',
            },
          ],
          _id: '638e16a90f1172261421c08e',
        },
      ],
      actived: true,
      isDefaultForm: true,
      __v: 0,
      createdAt: 1670782698,
      updatedAt: 1677008781,
      organizations: [
        {
          value: 'Bitkub',
          order: 1,
          _id: '63f234a803b80b754350df47',
        },
        {
          value: 'Vendor',
          order: 2,
          _id: '63f234a803b80b754350df48',
        },
      ],
    };
    let mockResultOfCriteriaKycServiceData = 
      {
        groupId: null,
        _id: '6390ebb2d3401b1f4c3487d3',
        criteriaKycFormId: '638e16a90f1172261421c08b',
        evaluateId: '6390e9b490eff982316e45fc',
        totalWeight: 95,
        netScore: 95,
        areaOfStrength: 'test',
        areaOfImprovement: 'test',
        listQuestions: [
          {
            questionId: '638e16a90f1172261421c08e',
            nonFatal: true,
            weightageScore: 10,
            result: 'yes',
            comments: ['test-comment-1', 'test-comment-2'],
            concernIssueValue: 'test-concern-2',
            organizationValue: 'test-organization-1',
            varianceResult: true,
            _id: '63a7f7621152fc25d30a30bc',
          },
        ],
        __v: 0,
        createdAt: 1670841128,
        isVarianced: false,
        completedDate: '2022-12-25T07:10:26.341Z',
        updatedAt: 1671952226,
      };
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceDataKYC);
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve(mcokStorageFilesServicesData);
    });
    jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockCriteriaKycServiceData);
    });
    jest.spyOn(await ResultEvaluateOfCriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockResultOfCriteriaKycServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/feedback');
    expect(response.statusCode).toEqual(200);
  });
  //   test('return status code 200, bad-analysis', async () => {
  //     let mockEvaluateServiceData = {
  //       __v: 0,
  //       _id: '63a3cc2aa934f7bb58bf750d',
  //       agentEmail: 'minnie.thirawat@bitkub.com',
  //       agentEmployeeId: '',
  //       agentId: '63126994a45b9496d1b1f432',
  //       agentName: 'Minnie Thirawat',
  //       areaOfImprovement: '',
  //       areaOfStrength: '',
  //       assignmentId: '63a34dc3a934f7bb58bf6ce6',
  //       assignmentRef: '903343',
  //       bpo: '',
  //       createdAt: 1671637864,
  //       date: '2022-12-22',
  //       dateOfCall: '',
  //       fileId: '',
  //       fileName: '903343',
  //       fileSize: 1,
  //       fileType: 'voice',
  //       formId: '63961ecc5721db84316c14ca',
  //       groupId: '63a32c76a934f7bb58bf566d',
  //       internalNote: '',
  //       isDispute: false,
  //       language: '',
  //       monitoringDate: 1671679017,
  //       monitoringTime: 1671679017,
  //       netScore: 25,
  //       note: '',
  //       percentage: 41.666666666666664,
  //       qaAgentEmail: 'qaagent01@bitkub.com',
  //       qaAgentId: '63a32ee4a934f7bb58bf61eb',
  //       result: '',
  //       status: 'completed',
  //       targetScore: 200,
  //       taskNumber: 'TN-20221222-000040',
  //       timeOfCall: '00:00:00',
  //       totalWeight: 60,
  //       trackType: 'bad-analysis',
  //       uid: '',
  //       updatedAt: null,
  //     };
  //     jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
  //       return Promise.resolve(mockEvaluateServiceData);
  //     });
  //     jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
  //       return Promise.resolve(mcokStorageFilesServicesData);
  //     });
  //     app.use(express.urlencoded({ extended: false }));
  //     app.use('/', router);
  //     let response = await request(app).get('/:evaluateId/feedback');
  //     expect(response.statusCode).toEqual(200);
  //   });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:evaluateId/feedback');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:evaluateId/on-break-time', () => {
  let mockEvaluateServiceData = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockReq = {
    action: 'on-break',
    dateTime: '2022-12-13T17:50:00.165Z',
  };
  test('return status code 400, Payload for create "On break time" was wrong', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/on-break-time');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/on-break-time').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await classOnBreakTimeUseCase, 'createOnBreakTime').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/on-break-time').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:evaluateId/on-break-time').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:evaluateId/on-break-time/:onBreakTimeId', () => {
  let mockEvaluateServiceData = {
    __v: 0,
    _id: '63a3cc2aa934f7bb58bf750d',
    agentEmail: 'minnie.thirawat@bitkub.com',
    agentEmployeeId: '',
    agentId: '63126994a45b9496d1b1f432',
    agentName: 'Minnie Thirawat',
    areaOfImprovement: '',
    areaOfStrength: '',
    assignmentId: '63a34dc3a934f7bb58bf6ce6',
    assignmentRef: '903343',
    bpo: '',
    createdAt: 1671637864,
    date: '2022-12-22',
    dateOfCall: '',
    fileId: '',
    fileName: '903343',
    fileSize: 1,
    fileType: 'voice',
    formId: '63961ecc5721db84316c14ca',
    groupId: '63a32c76a934f7bb58bf566d',
    internalNote: '',
    isDispute: false,
    language: '',
    monitoringDate: 1671679017,
    monitoringTime: 1671679017,
    netScore: 25,
    note: '',
    percentage: 41.666666666666664,
    qaAgentEmail: 'qaagent01@bitkub.com',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    result: '',
    status: 'completed',
    targetScore: 200,
    taskNumber: 'TN-20221222-000040',
    timeOfCall: '00:00:00',
    totalWeight: 60,
    trackType: 'criteria-qa-cs',
    uid: '',
    updatedAt: null,
  };
  let mockReq = {
    dateTime: '2022-12-13T17:50:00.165Z',
  };
  test('return status code 400, Evaluate not found', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/on-break-time/:onBreakTimeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Payload for update "On break time" was wrong', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/on-break-time/:onBreakTimeId').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, On break time can not update, because on-break-time is archived', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await classOnBreakTimeUseCase, 'updateOnBreakTime').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/on-break-time/:onBreakTimeId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockEvaluateServiceData);
    });
    jest.spyOn(await classOnBreakTimeUseCase, 'updateOnBreakTime').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/on-break-time/:onBreakTimeId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Evalute internal service error', async () => {
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:evaluateId/on-break-time/:onBreakTimeId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});
