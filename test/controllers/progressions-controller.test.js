const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');
const moment = require('moment-timezone');

const dateFormat = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const progressionController = require(path.resolve(`${dirname}/src/controllers/progressions.controller.js`));
const ProgressionRepository = new repositoriesDb.progressionRepository();
const UserRepository = new repositoriesDb.userRepository();
const GroupRepository = new repositoriesDb.groupRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = progressionController({
  progressionRepository: ProgressionRepository,
  userRepository: UserRepository,
  groupRepository: GroupRepository,
  memberRepository: MemberRepository,
  auditlogRepository: AuditlogRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /', () => {
  let mockData = [
    {
      _id: '63a33f09a934f7bb58bf69eb',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      qaAgentEmail: 'qaagent01@bitkub.com',
      groupId: '63bc5224f9e16f803af7374a',
      groupName: 'TestDoo',
      type: 'on-duty',
      date: '2022-12-22',
      status: true,
      startTime: 1671642889,
      endTime: 1671716127,
      amount: 73238,
      createdAt: 1671637864,
      updatedAt: null,
      __v: 0,
      properties: {},
    },
    {
      _id: '63a420b7a934f7bb58c02473',
      qaAgentId: '63a32444f8006663a8a4c2f8',
      qaAgentEmail: 'qa01@bitkub.com',
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      type: 'on-duty',
      date: '2022-12-22',
      status: false,
      startTime: 1671700663,
      endTime: 1671722255,
      amount: 21592,
      createdAt: 1671637864,
      updatedAt: null,
      __v: 0,
      properties: {},
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await ProgressionRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Progression Internal server error, Please contact to Admin', async () => {
    jest.spyOn(await ProgressionRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:progressId', () => {
  test('return status code 400, progression not found', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:progressId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:progressId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Progression Internal server error, Please contact to Admin', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:progressId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /', () => {
  let mockReq = {
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    type: 'on-duty',
    status: true,
    properties: {},
  };
  let mockUsersDbServicesData = {
    _id: '63a31d075129389041d7faa6',
    username: 'agent001',
    email: 'agent001@bitkub.com',
    level: 'qaAgent',
    status: 'active',
    type: 'SITE_AUTHEN',
    imageId: '63e277011c170ea961a8ab31',
    signatureId: null,
    createdAt: 1671634183,
    updatedAt: null,
    __v: 0,
    groupId: '63a5bcebe3d6b191cb76bd80',
    groupName: 'Productive group',
    memberId: '63b9477d4143b59e553baba3',
  };
  let mockMemberServicesData = {
    _id: '63a3d046a934f7bb58bf761a',
    groupId: '63a32c76a934f7bb58bf566d',
    userId: '6327dc35d2ee7d0a8a719b3e',
    name: 'agent07',
    email: 'agent07@bitkub.com',
    role: 'agent',
    createdAt: 1671637864,
    updatedAt: null,
    __v: 0,
  };
  let mockGroupsDbServicesData = {
    _id: '63a32c76a934f7bb58bf566d',
    name: 'Test authority 1',
    tag: 'testauthority1',
    createdAt: 1671637864,
    updatedAt: null,
    __v: 0,
    amountQaAgent: 2,
    amountAgent: 2,
  };
  let mockProgressionServicesData = {
    _id: '63a6f760f515c023a1c5337a',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    qaAgentEmail: 'qaagent01@bitkub.com',
    groupId: '63bc5224f9e16f803af7374a',
    groupName: 'TestDoo',
    type: 'on-duty',
    date: '2022-12-24',
    status: true,
    startTime: 1671886688,
    endTime: 0,
    amount: 0,
    createdAt: 1671886099,
    updatedAt: null,
    __v: 0,
  };
  let mockAuditlogServicesData = {
    action: 'onduty-started',
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
    service: 'progression',
    userId: '62372f2229001d280317d04a',
  };
  let mockMember = {
    _id: '63d0a2e4effb956d7f236ead',
    groupId: '63b72539aab0c589a9b6771c',
    userId: '6313b298849e6cca2c57505c',
    name: 'agent01',
    email: 'agent01@bitkub.com',
    role: 'agent',
    createdAt: 1674141668,
    updatedAt: null,
    __v: 0,
  };
  test('return status code 400, Progression cannot create because some field was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, qa agent not found', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, progress has ready exit', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberServicesData);
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockProgressionServicesData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  // test('return status code 400, convert data for create was wrong', async () => {
  //   jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve(mockUsersDbServicesData);
  //   });
  //   jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve(mockProgressionServicesData);
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).post('/').send(mockReq);
  //   expect(response.statusCode).toEqual(400);
  // });
  test('return status code 200', async () => {
    let mockProgressionServicesData = {
      _id: '63a6f760f515c023a1c5337a',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      qaAgentEmail: 'qaagent01@bitkub.com',
      groupId: '63bc5224f9e16f803af7374a',
      groupName: 'TestDoo',
      type: 'on-duty',
      date: dateFormat,
      status: true,
      startTime: 1671886688,
      endTime: 0,
      amount: 0,
      createdAt: 1671886099,
      updatedAt: null,
      __v: 0,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockProgressionServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, create-progression error-create-auditlog', async () => {
    let mockProgressionServicesData = {
      _id: '63a6f760f515c023a1c5337a',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      qaAgentEmail: 'qaagent01@bitkub.com',
      groupId: '63bc5224f9e16f803af7374a',
      groupName: 'TestDoo',
      type: 'on-duty',
      date: dateFormat,
      status: true,
      startTime: 1671886688,
      endTime: 0,
      amount: 0,
      createdAt: 1671886099,
      updatedAt: null,
      __v: 0,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockProgressionServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMember);
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, create-progression error-create-auditlog', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMember);
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Progression Internal server error, Please contact to Admin', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:progressId', () => {
  let mockReq = {
    status: true,
    properties: {},
  };
  let mockProgressionServicesData = {
    _id: '63a33f09a934f7bb58bf69eb',
    qaAgentId: '63a32ee4a934f7bb58bf61eb',
    qaAgentEmail: 'qaagent01@bitkub.com',
    groupId: '63a32c76a934f7bb58bf566d',
    groupName: 'Test authority 1',
    type: 'on-duty',
    date: '2022-12-22',
    status: true,
    startTime: 1671642889,
    endTime: 1671716127,
    amount: 73238,
    createdAt: 1671637864,
    updatedAt: null,
    __v: 0,
  };
  let mockGroupsDbServicesData = {
    _id: '63a32c76a934f7bb58bf566d',
    name: 'Test authority 1',
    tag: 'testauthority1',
    createdAt: 1671637864,
    updatedAt: null,
    __v: 0,
    amountQaAgent: 2,
    amountAgent: 2,
  };
  let mockAuditlogServicesData = {
    _id: '637d0e5fb839d958ccc028af',
    userId: '624af91992655c203fa6851a',
    service: 'progression',
    action: 'onduty-ended',
    reason: '',
    tag: '1',
    properties: {
      _id: '637d0cb1b839d958ccc025ee',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      type: 'on-duty',
      date: '2022-11-23',
      status: false,
      startTime: 1669139633,
      endTime: 1669140063,
      amount: 430,
      __v: 0,
    },
    __v: 0,
    createdAt: 1669140063,
    date: '2022-11-23',
    updatedAt: 1677321459,
  };
  test('return status code 400, Progression cannot create because some field was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:progressId').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, progress not found', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:progressId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockProgressionServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:progressId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, update-progression error-create-auditlog', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockProgressionServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await ProgressionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAuditlogServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:progressId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Progression Internal server error, Please contact to Admin', async () => {
    jest.spyOn(await ProgressionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:progressId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});
