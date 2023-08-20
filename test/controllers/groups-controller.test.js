const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const groupsController = require(path.resolve(`${dirname}/src/controllers/groups.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const GroupRepository = new repositoriesDb.groupRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const OverviewRepository = new repositoriesDb.overviewRepository();
const AccessibilitieRepository = new repositoriesDb.accessibilitieRepository();
const PermissionRepository = new repositoriesDb.permissionRepository();
const AgentRepository = new repositoriesDb.agentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const ProgressionRepository = new repositoriesDb.progressionRepository();
const GradesRepository = new repositoriesDb.gradesRepository();

const gradeDto = require(path.resolve(`${dirname}/src/dto/grades.dto`));

let router = groupsController({
  userRepository: UserRepository,
  groupRepository: GroupRepository,
  memberRepository: MemberRepository,
  overviewRepository: OverviewRepository,
  accessibilitieRepository: AccessibilitieRepository,
  permissionRepository: PermissionRepository,
  agentRepository: AgentRepository,
  auditlogRepository: AuditlogRepository,
  progressionRepository: ProgressionRepository,
  gradesRepository: GradesRepository,
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /', () => {
  let mockData = [
    {
      _id: '63b72539aab0c589a9b6771c',
      name: 'jjjj',
      tag: 'jjjj',
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
      amountQaAgent: 3,
      amountAgent: 2,
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'getGroupsWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    jest.spyOn(await MemberRepository, 'countMemberWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('3');
    });
    jest.spyOn(await MemberRepository, 'countMemberWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('2');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Form service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getGroupsWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /', () => {
  test('return status code 400, group cannot create because some field was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group has already exists', async () => {
    let mockReq = {
      groupName: 'test groupName',
    };
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group cannot create', async () => {
    let mockReq = {
      groupName: 'test groupName',
    };
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      groupName: 'test groupName',
    };
    let mockData = [
      {
        _id: '63b72539aab0c589a9b6771f',
        groupId: '63b72539aab0c589a9b6771c',
        permissionId: '63388a5c669f47947e808084',
        permissionName: 'settingMemu.agentProductivityAllowed',
        permissionKey: 'menuAgentProductivityAllowed',
        actived: true,
        createdAt: 1672857703,
        updatedAt: null,
        __v: 0,
      },
      {
        _id: '63b72539aab0c589a9b67720',
        groupId: '63b72539aab0c589a9b6771c',
        permissionId: '63388a5d669f47947e808086',
        permissionName: 'settingMemu.dailyTaskAllowed',
        permissionKey: 'menuDailyTaskAllowed',
        actived: true,
        createdAt: 1672857703,
        updatedAt: null,
        __v: 0,
      },
      {
        _id: '63b72539aab0c589a9b67721',
        groupId: '63b72539aab0c589a9b6771c',
        permissionId: '63388a5d669f47947e808088',
        permissionName: 'settingMemu.disputeFunctionAllowed',
        permissionKey: 'menuDisputeFunctionAllowed',
        actived: true,
        createdAt: 1672857703,
        updatedAt: null,
        __v: 0,
      },
    ];
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await PermissionRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    jest.spyOn(await AccessibilitieRepository, 'createMany').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    let mockReq = {
      groupName: 'test groupName',
    };
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:groupId', () => {
  let mockGroupById = {
    _id: '63b72539aab0c589a9b6771c',
    name: 'jjjj',
    tag: 'jjjj',
    createdAt: 1672857703,
    updatedAt: null,
    __v: 0,
    agentList: [
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
    ],
    qaAgentList: [
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
    ],
    superVisorList: [
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
    ],
    assistManagerList: [
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
    ],
  };
  let mockAgent = [
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
  let mockQaAgent = [
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
  let mockSuperViser = [
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
  ];
  let mockAssistManager = [
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
  ];
  test('return status code 400, Form service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupById);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAgent);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockQaAgent);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockSuperViser);
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockAssistManager);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:groupId', () => {
  test('return status code 400, group cannot update because some field was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group not found', async () => {
    let mockReq = {
      name: 'test name',
    };
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group has already exists', async () => {
    let mockReq = {
      name: 'test name',
    };
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group cannot update because some field was wrong', async () => {
    let mockReq = {
      name: 'test name',
    };
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'updateGroupByObj').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      name: 'test name',
    };
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'updateGroupByObj').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    let mockReq = {
      name: 'test name',
    };
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:groupId', () => {
  test('return status code 400, group cannot delete', async () => {
    jest.spyOn(await GroupRepository, 'deleteGroup').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockMemberRepositoryData = [
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
    ];
    let mockDelete = [
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
    ];
    jest.spyOn(await GroupRepository, 'deleteGroup').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberRepositoryData);
    });
    jest.spyOn(await MemberRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve(mockDelete);
    });
    jest.spyOn(await ProgressionRepository, 'deleteMany').mockImplementationOnce(async () => {
      return Promise.resolve(mockDelete);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'deleteGroup').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:groupId/members', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/members');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/members');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/members');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:groupId/members', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, member of group cannot create because some field was wrong', async () => {
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, member has fail to join group', async () => {
    let mockReq = {
      userId: '624fe297790139ea1d6885c7',
      name: 'test name',
      email: 'test@email.com',
      role: 'assistManager',
    };
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AgentRepository, 'checkAgentExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await UserRepository, 'checkUserExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, member has already join group', async () => {
    let mockReq = {
      userId: '624fe297790139ea1d6885c7',
      name: 'test name',
      email: 'test@email.com',
      role: 'assistManager',
    };
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AgentRepository, 'checkAgentExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'checkUserExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, member has fail to join group', async () => {
    let mockReq = {
      userId: '624fe297790139ea1d6885c7',
      name: 'test name',
      email: 'test@email.com',
      role: 'assistManager',
    };
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AgentRepository, 'checkAgentExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'checkUserExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await MemberRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      userId: '624fe297790139ea1d6885c7',
      name: 'test name',
      email: 'test@email.com',
      role: 'qaAgent',
    };
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AgentRepository, 'checkAgentExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'checkUserExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await ProgressionRepository, 'updateManyWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/members');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:groupId/members/:memberId', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/members/:memberId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, member not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/members/:memberId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, fail to delete this member from group', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/members/:memberId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'checkMemberExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await MemberRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/members/:memberId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/members/:memberId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:groupId/accessibilities', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/accessibilities');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AccessibilitieRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/accessibilities');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/accessibilities');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:groupId/grade-settings', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    /* jest.spyOn(await GradesRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    }); */
    jest.spyOn(await GradesRepository, 'getListWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:groupId/grade-settings/:gradeId', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, grade not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    /* jest.spyOn(await GradesRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    }); */
    jest.spyOn(await GradesRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /:groupId/grade-settings', () => {
  let mockReq = [
    {
      label: 'test label',
      min: 500,
      max: 100,
    },
    {
      label: 'test label2',
      min: 500,
      max: 100,
    },
  ];
  test('return status code 400, payload of grade data was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/grade-settings').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/grade-settings').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, grade has already exist in this group', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    

    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/grade-settings').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });

    jest.spyOn(gradeDto, 'createGradeDTO').mockImplementationOnce(() => {
      return 'Success';
    });

    jest.spyOn(await GradesRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/grade-settings').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/:groupId/grade-settings').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:groupId/grade-settings/:gradeId', () => {
  let mockReq = [
    {
      label: 'test label',
      min: 500,
      max: 100,
    },
    {
      label: 'test label2',
      min: 500,
      max: 100,
    },
  ];
  test('return status code 400, payload of grade data was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId/grade-settings/:gradeId').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId/grade-settings/:gradeId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, grade not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId/grade-settings/:gradeId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(gradeDto, 'updateGradeDTO').mockImplementationOnce(() => {
      return 'Success';
    });
    jest.spyOn(await GradesRepository, 'update').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId/grade-settings/:gradeId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:groupId/grade-settings/:gradeId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:groupId/grade-settings/:gradeId', () => {
  test('return status code 400, group not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, grade not found', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'isExist').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await GradesRepository, 'deleteOne').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Group service internal server error', async () => {
    jest.spyOn(await GroupRepository, 'checkGroupExist').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:groupId/grade-settings/:gradeId');
    expect(response.statusCode).toEqual(500);
  });
});
