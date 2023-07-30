const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const settingController = require(path.resolve(`${dirname}/src/controllers/settings.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const GroupRepository = new repositoriesDb.groupRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const OverviewRepository = new repositoriesDb.overviewRepository();
const TimeSettingRepository = new repositoriesDb.timeSettingRepository();
const AccessibilitieRepository = new repositoriesDb.accessibilitieRepository();
const PermissionRepository = new repositoriesDb.permissionRepository();
const ConsentRepository = new repositoriesDb.consentRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AgentRepository = new repositoriesDb.agentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = settingController({
  userRepository: UserRepository,
  groupRepository: GroupRepository,
  memberRepository: MemberRepository,
  overviewRepository: OverviewRepository,
  timeSettingRepository: TimeSettingRepository,
  accessibilitieRepository: AccessibilitieRepository,
  permissionRepository: PermissionRepository,
  consentRepository: ConsentRepository,
  attachmentRepository: AttachmentRepository,
  agentRepository: AgentRepository,
  auditlogRepository: AuditlogRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /users', () => {
  let mockUserRepositoryResponse = [
    {
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
    },
    {
      _id: '63a32444f8006663a8a4c2f8',
      username: 'qa01',
      email: 'qa01@bitkub.com',
      level: 'qaAgent',
      status: 'active',
      type: 'SITE_AUTHEN',
      imageId: '63bbf90e3d27d085640c739f',
      signatureId: '63e26fd8353497902a0a6f42',
      createdAt: 1671636036,
      updatedAt: null,
      __v: 0,
      groupId: '63b72539aab0c589a9b6771c',
      groupName: 'jjjj',
      memberId: '63b76dbeaab0c589a9b70391',
    },
    {
      _id: '63a32ee4a934f7bb58bf61eb',
      username: 'qaagent01',
      email: 'qaagent01@bitkub.com',
      level: 'qaAgent',
      status: 'active',
      type: 'SITE_AUTHEN',
      imageId: null,
      signatureId: null,
      createdAt: 1671638756,
      updatedAt: null,
      __v: 0,
      groupId: '63bc5224f9e16f803af7374a',
      groupName: 'TestDoo',
      memberId: '63bc5224f9e16f803af73774',
      signedImageUri: null,
    },
  ];
  let mockMemberRepositoryResponse = [
    {
      _id: '63b76dbeaab0c589a9b70391',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '63a32444f8006663a8a4c2f8',
      name: 'qa01',
      email: 'qa01@bitkub.com',
      role: 'qaAgent',
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63d0a2e4effb956d7f236ead',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '6313b298849e6cca2c57505c',
      name: 'agent01',
      email: 'agent01@bitkub.com',
      role: 'agent',
      createdAt: 1674141668,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63d0a2e4effb956d7f236eb2',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '6313b2a1849e6cca2c57505f',
      name: 'agent02',
      email: 'agent02@bitkub.com',
      role: 'agent',
      createdAt: 1674141668,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63d0a2e4effb956d7f236ebc',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '63a5b9efe3d6b191cb76bb9b',
      name: 'Assistuser001',
      email: 'assistuser001@bitkub.com',
      role: 'assistManager',
      createdAt: 1674141668,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63e291f61c170ea961a939d1',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '63a5b9c9e3d6b191cb76bb75',
      name: 'SUperuser001@bitkub',
      email: 'superuser001@bitkub.com',
      role: 'superVisor',
      createdAt: 1675792886,
      updatedAt: 1675792886,
      __v: 0,
    },
    {
      _id: '63e3cfb46d8a39dbebe5a332',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '63dfb9e45e1fdf8ab5c31396',
      name: 'ritzjane@gmail.com',
      email: 'ritzjane@gmail.com',
      role: 'qaAgent',
      createdAt: 1675874228,
      updatedAt: 1675874228,
      __v: 0,
    },
    {
      _id: '63ebec21ce175fb00af8b797',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '63ebec21ce175fb00af8b792',
      name: 'test1234',
      email: 'agentqa1234@bitkub.com',
      role: 'qaAgent',
      createdAt: 1676405793,
      updatedAt: 1676405793,
      __v: 0,
    },
  ];
  let mockAttachmentRepositoryResponse = [
    {
      _id: '630d0ef3806854eff19955a1',
      fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      typeFile: 'voice-file',
      sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      fieldname: 'audio',
      originalname: 'Test voice file small 1 copy 2.mp3',
      size: 3202408,
      bucket: 'bitqast-dev',
      key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      __v: 0,
    },
    {
      _id: '630d0ef4806854eff19955a3',
      fileName: 'bitqast-ebeda0a5-280a-48e9-83be-b926cd3ee00f.mp3',
      typeFile: 'voice-file',
      sourceFile: '/voices/2022-08-30/bitqast-ebeda0a5-280a-48e9-83be-b926cd3ee00f.mp3',
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-ebeda0a5-280a-48e9-83be-b926cd3ee00f.mp3',
      fieldname: 'audio',
      originalname: 'Test voice file small 1 copy 3.mp3',
      size: 3202408,
      bucket: 'bitqast-dev',
      key: 'voices/2022-08-30/bitqast-ebeda0a5-280a-48e9-83be-b926cd3ee00f.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-ebeda0a5-280a-48e9-83be-b926cd3ee00f.mp3',
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      __v: 0,
    },
    {
      _id: '630d0ef5806854eff19955a5',
      fileName: 'bitqast-a860d60e-c846-4b6a-9f60-a9887cecbf80.mp3',
      typeFile: 'voice-file',
      sourceFile: '/voices/2022-08-30/bitqast-a860d60e-c846-4b6a-9f60-a9887cecbf80.mp3',
      uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-a860d60e-c846-4b6a-9f60-a9887cecbf80.mp3',
      fieldname: 'audio',
      originalname: 'Test voice file small 1 copy 4.mp3',
      size: 3202408,
      bucket: 'bitqast-dev',
      key: 'voices/2022-08-30/bitqast-a860d60e-c846-4b6a-9f60-a9887cecbf80.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-a860d60e-c846-4b6a-9f60-a9887cecbf80.mp3',
      etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
      __v: 0,
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'getAllUsers').mockImplementationOnce(async () => {
      return Promise.resolve(mockUserRepositoryResponse);
    });
    jest.spyOn(await MemberRepository, 'getMemberAndGroupInfo').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberRepositoryResponse);
    });
    jest.spyOn(await AttachmentRepository, 'getAllWithSignedUrl').mockImplementationOnce(async () => {
      return Promise.resolve(mockAttachmentRepositoryResponse);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/users');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting user internal server error', async () => {
    jest.spyOn(await UserRepository, 'getAllUsers').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/users');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /users', () => {
  let mockReq = {
    email: 'testdeactive@bitkub.com',
    username: 'testdeactive',
    level: 'qaAgent',
    password: 'password1234',
    status: 'active',
  };
  test('return status code 400, payload for create user was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/users');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, user has already exists', async () => {
    jest.spyOn(await UserRepository, 'checkDupEmailAndUssername').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/users').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Can not create user', async () => {
    jest.spyOn(await UserRepository, 'checkDupEmailAndUssername').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await UserRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/users').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'checkDupEmailAndUssername').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await UserRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/users').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting user internal server error', async () => {
    jest.spyOn(await UserRepository, 'checkDupEmailAndUssername').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/users').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /users/:userId', () => {
  test('return status code 400, user not found', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/users/:userId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AttachmentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AttachmentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/users/:userId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting user internal server error', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/users/:userId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /users/:userId', () => {
  let mockReq = {
    username: 'admin111',
    status: 'active',
  };
  let mockWrongUsername = {
    username: 'test2 username',
  };
  let mockSuccessData = {
    _id: '63bdc6cdf9e16f803af87957',
    username: 'admin111',
    email: 'admin111@bitkub.com',
    level: 'qaAgent',
    status: 'active',
    type: 'SITE_AUTHEN',
    imageId: null,
    signatureId: null,
    createdAt: 1673381581,
    updatedAt: null,
    __v: 0,
    imageData: null,
    signatureData: null,
    groupId: '63bdc68bf9e16f803af87801',
    memberId: '63bdc6cdf9e16f803af8795d',
    groupName: 'tna',
    signedImageUri: null,
    signedSignatureUri: null,
  };
  test('return status code 400, payload for update user was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/users/:userId').send({ status: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, user not found', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/users/:userId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, user has already exists', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockSuccessData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/users/:userId').send({ username: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockSuccessData);
    });
    jest.spyOn(await UserRepository, 'updateUserByObject').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/users/:userId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting user internal server error', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/users/:userId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /users/:userId', () => {
  test('return status code 400, user not found', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/users/:userId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'deleteUser').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'clearRequestSignIn').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/users/:userId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting user internal server error', async () => {
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/users/:userId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /overview', () => {
  test('return status code 200', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/overview');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Overview Internal server error', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/overview');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /overview', () => {
  test('return status code 400, Overview data not found', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/overview');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Overview cannot updated', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await OverviewRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/overview');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await OverviewRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/overview');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Overview Internal server error', async () => {
    jest.spyOn(await OverviewRepository, 'getOverviewData').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/overview');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /times', () => {
  test('return status code 200', async () => {
    jest.spyOn(await TimeSettingRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/times');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await TimeSettingRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/times');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /times/:timeId', () => {
  test('return status code 400, Setting time data not found', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/times/:timeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/times/:timeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/times/:timeId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /times', () => {
  let mockReq = {
    fieldName: 'test fieldName',
    type: 'test type',
    tag: 'test tag',
    actived: true,
  };
  test('return status code 400, payload for create setting time was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/times');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Setting time cannot created', async () => {
    jest.spyOn(await TimeSettingRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/times').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TimeSettingRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/times').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await TimeSettingRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/times').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /times/:timeId', () => {
  test('return status code 400, Setting time data not found', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/times/:timeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Setting time cannot updated', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TimeSettingRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/times/:timeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TimeSettingRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/times/:timeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/times/:timeId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /times/:timeId', () => {
  test('return status code 400, Setting time data not found', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/times/:timeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await TimeSettingRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/times/:timeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await TimeSettingRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/times/:timeId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /accessibilities', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AccessibilitieRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/accessibilities');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await AccessibilitieRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/accessibilities');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /accessibilities', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/accessibilities');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, permission not found', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/accessibilities');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, accessibilities has already exists', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AccessibilitieRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/accessibilities');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AccessibilitieRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await AccessibilitieRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/accessibilities');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Time Internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/accessibilities');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /permissions', () => {
  test('return status code 200', async () => {
    jest.spyOn(await PermissionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/permissions');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, setting permission controller error something', async () => {
    jest.spyOn(await PermissionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/permissions');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /permissions', () => {
  let mockReq = {
    name: 'settingMemu.varianceAllowed',
    key: 'menuVarianceAllowed',
  };
  test('return status code 400, payload for create permission was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/permissions');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await PermissionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/permissions').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, setting permission controller error something', async () => {
    jest.spyOn(await PermissionRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/permissions').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /permissions/:permissionId', () => {
  let mockReq = {
    name: 'test name',
    key: 'test key',
  };
  test('return status code 400, payload for create permission was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/permissions/:permissionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, permission not found', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/permissions/:permissionId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/permissions/:permissionId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, setting permission controller error something', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/permissions/:permissionId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /permissions/:permissionId', () => {
  test('return status code 400, permission not found', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/permissions/:permissionId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/permissions/:permissionId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, setting permission controller error something', async () => {
    jest.spyOn(await PermissionRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/permissions/:permissionId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /agents', () => {
  let mockReq = {
    groupIsNull: 'test groupIsNull',
    email: 'test email',
    agentNumber: 'test agentNumber',
    username: 'test username',
  };
  let mockAgentRepositoryResponse = [
    {
      _id: '6313b298849e6cca2c57505c',
      email: 'agent01@bitkub.com',
      agentNumber: '000001',
      employeeId: '1123123',
      username: 'agent01',
      name: '',
      __v: 0,
    },
    {
      _id: '6313b2a1849e6cca2c57505f',
      email: 'agent02@bitkub.com',
      agentNumber: '000123',
      employeeId: '1123122',
      username: 'agent02',
      name: '',
      __v: 0,
    },
  ];
  let mockMemberRepositoryResponse = [
    {
      _id: '63d0a2e4effb956d7f236ead',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '6313b298849e6cca2c57505c',
      name: 'agent01',
      email: 'agent01@bitkub.com',
      role: 'agent',
      createdAt: 1674141668,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63d0a2e4effb956d7f236eb2',
      groupId: '63b72539aab0c589a9b6771c',
      userId: '6313b2a1849e6cca2c57505f',
      name: 'agent02',
      email: 'agent02@bitkub.com',
      role: 'agent',
      createdAt: 1674141668,
      updatedAt: null,
      __v: 0,
    },
  ];
  test('return status code 400, Params query for get agent was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents').query({ test: false });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AgentRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AgentRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentRepositoryResponse);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberRepositoryResponse);
    });
    jest.spyOn(await AgentRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgentRepositoryResponse);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberRepositoryResponse);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents').query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Agent internal server error', async () => {
    jest.spyOn(await AgentRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /agents/:agentId', () => {
  test('return status code 400, Agent not found', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents/:agentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents/:agentId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Agent internal server error', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agents/:agentId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /agents', () => {
  let mockReq = {
    employeeId: 'test employeeId',
    agentNumber: 'test12',
    email: 'test email',
  };
  test('return status code 400, Payload for create agent was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/agents');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Agent has already exists', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/agents').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(null);
    });
    jest.spyOn(await AgentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/agents').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Agent internal server error', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/agents').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /agents/:agentId', () => {
  test('return status code 400, Agent not found', async () => {
    jest.spyOn(await AgentRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/agents/:agentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AgentRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/agents/:agentId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting Agent internal server error', async () => {
    jest.spyOn(await AgentRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/agents/:agentId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /consents', () => {
  test('return status code 200', async () => {
    jest.spyOn(await ConsentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/consents');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting consent internal server error', async () => {
    jest.spyOn(await ConsentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/consents');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /consents', () => {
  let mockReq = {
    groupId: 'test groupId',
    groupName: 'test groupName',
    userRequest: 'test userRequest',
    changeListts: [
      {
        _id: '63389e8c743095ee2246f6d9',
        actived: false,
        groupId: '63389e8c743095ee2246f6d3',
        permissionId: '63388a5c669f47947e808084',
        permissionKey: 'menuAgentProductivityAllowed',
        permissionName: 'settingMemu.agentProductivityAllowed',
      },
      {
        _id: '63389e8c743095ee2246f6dc',
        actived: false,
        groupId: '63389e8c743095ee2246f6d3',
        permissionId: '63388a5d669f47947e808086',
        permissionKey: 'menuDailyTaskAllowed',
        permissionName: 'settingMemu.dailyTaskAllowed',
      },
    ],
  };
  let mockGroupRepositoryData = {
    _id: '63a5bcebe3d6b191cb76bd80',
    name: 'Productive group',
    tag: 'productivegroup',
    createdAt: 1671778845,
    updatedAt: null,
    __v: 0,
    agentList: [],
    qaAgentList: [
      {
        _id: '63b9477d4143b59e553baba3',
        groupId: '63a5bcebe3d6b191cb76bd80',
        userId: '63a31d075129389041d7faa6',
        name: 'agent001',
        email: 'agent001@bitkub.com',
        role: 'qaAgent',
        createdAt: 1673086828,
        updatedAt: null,
        __v: 0,
      },
    ],
    superVisorList: [],
    assistManagerList: [],
  };
  let mockConsentRepositoryDataExist = [
    {
      _id: '63b737deaab0c589a9b6bf41',
      groupId: '63b737deaab0c589a9b6bf18',
      groupName: 'Automated Group Test',
      userRequest: 'admin@bitkub.com',
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionName: 'settingMemu.agentProductivityAllowed',
          permissionKey: 'menuAgentProductivityAllowed',
          actived: false,
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionName: 'settingMemu.dailyTaskAllowed',
          permissionKey: 'menuDailyTaskAllowed',
          actived: false,
        },
      ],
      status: 'pending',
      achieved: true,
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
    },
  ];
  let mockConsentRepositoryData = [
    {
      _id: '63b737deaab0c589a9b6bf41',
      groupId: '63b737deaab0c589a9b6bf18',
      groupName: 'Automated Group Test',
      userRequest: 'admin@bitkub.com',
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionName: 'settingMemu.agentProductivityAllowed',
          permissionKey: 'menuAgentProductivityAllowed',
          actived: false,
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionName: 'settingMemu.dailyTaskAllowed',
          permissionKey: 'menuDailyTaskAllowed',
          actived: false,
        },
      ],
      status: 'approved',
      achieved: true,
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
    },
    {
      _id: '63b78a6eaab0c589a9b72887',
      groupId: '63b78a6eaab0c589a9b7285e',
      groupName: 'Automated Group Test',
      userRequest: 'admin@bitkub.com',
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionName: 'settingMemu.agentProductivityAllowed',
          permissionKey: 'menuAgentProductivityAllowed',
          actived: false,
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionName: 'settingMemu.dailyTaskAllowed',
          permissionKey: 'menuDailyTaskAllowed',
          actived: false,
        },
      ],
      status: 'approved',
      achieved: true,
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
    },
  ];
  test('return status code 400, payload for create consent was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/consents');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/consents').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group has already exists', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupRepositoryData);
    });
    jest.spyOn(await ConsentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockConsentRepositoryDataExist);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/consents').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupRepositoryData);
    });
    jest.spyOn(await ConsentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockConsentRepositoryData);
    });
    jest.spyOn(await ConsentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/consents').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting consent internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/consents').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /consents/:consentId', () => {
  let mockConsentRepositoryData = {
    _id: '63b737c0aab0c589a9b6bd9a',
    groupId: '63b737c0aab0c589a9b6bd71',
    groupName: 'Automated Group Test',
    userRequest: 'admin@bitkub.com',
    changeListts: [
      {
        _id: '63389e8c743095ee2246f6d9',
        groupId: '63389e8c743095ee2246f6d3',
        permissionId: '63388a5c669f47947e808084',
        permissionName: 'settingMemu.agentProductivityAllowed',
        permissionKey: 'menuAgentProductivityAllowed',
        actived: false,
      },
      {
        _id: '63389e8c743095ee2246f6dc',
        groupId: '63389e8c743095ee2246f6d3',
        permissionId: '63388a5d669f47947e808086',
        permissionName: 'settingMemu.dailyTaskAllowed',
        permissionKey: 'menuDailyTaskAllowed',
        actived: false,
      },
    ],
    status: 'approved',
    achieved: true,
    createdAt: 1672857703,
    updatedAt: null,
    __v: 0,
  };
  let mockAccessibilitieRepositoryData = {
    _id: '63b737c0aab0c589a9b6bd74',
    groupId: '63b737c0aab0c589a9b6bd71',
    permissionId: '63388a5c669f47947e808084',
    permissionName: 'settingMemu.agentProductivityAllowed',
    permissionKey: 'menuAgentProductivityAllowed',
    actived: false,
    createdAt: 1672857703,
    updatedAt: null,
    __v: 0,
  };
  test('return status code 400, consent not found', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/consents/:consentId').send({ status: 'test' });
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, consent not found', async () => {
    jest.spyOn(await ConsentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/consents/:consentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, status == approved', async () => {
    jest.spyOn(await ConsentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockConsentRepositoryData);
    });
    jest.spyOn(await AccessibilitieRepository, 'getOneByFilter').mockImplementation(async () => {
      return Promise.resolve(mockAccessibilitieRepositoryData);
    });
    jest.spyOn(await AccessibilitieRepository, 'update').mockImplementation(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await ConsentRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/consents/:consentId').send({ status: 'approved' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200', async () => {
    jest.spyOn(await ConsentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockConsentRepositoryData);
    });
    jest.spyOn(await AccessibilitieRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAccessibilitieRepositoryData);
    });
    jest.spyOn(await ConsentRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/consents/:consentId').send({ status: 'pending' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Setting consent internal server error', async () => {
    jest.spyOn(await ConsentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/consents/:consentId').send({ status: 'approved' });
    expect(response.statusCode).toEqual(500);
  });
});
