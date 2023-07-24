const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const assignmentController = require(path.resolve(`${dirname}/src/controllers/assignments.controller.js`));
const GroupRepository = new repositoriesDb.groupRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
const CriteriaQaCsRepository = new repositoriesDb.criteriaQaCsRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AgentRepository = new repositoriesDb.agentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const EvaluateRepository = new repositoriesDb.evaluateRepository();
const BadAnalysisFormRepository = new repositoriesDb.badAnalysisFormRepository();
const CriteriaKycRepository = new repositoriesDb.criteriaKycRepository();
let router = assignmentController({
  groupRepository: GroupRepository,
  assignmentRepository: AssignmentRepository,
  criteriaQaCsRepository: CriteriaQaCsRepository,
  attachmentRepository: AttachmentRepository,
  agentRepository: AgentRepository,
  auditlogRepository: AuditlogRepository,
  evaluateRepository: EvaluateRepository,
  badAnalysisFormRepository: BadAnalysisFormRepository,
  criteriaKycRepository: CriteriaKycRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AssignmentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/').query({ assignStartDate: 'test', assignEndDate: 'test' });
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, assignment controller error something', async () => {
    jest.spyOn(await AssignmentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:assignmentid', () => {
  test('return status code 400', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(400);
  });
  test('return 200 case TrackTypeEnum = bad-analysis', async () => {
    let mockTrackTypeEnum = {
      trackType: 'bad-analysis',
      formId: 'test1234',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockTrackTypeEnum);
    });
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(200);
  });
  test('return 200 case TrackTypeEnum = criteria-kyc', async () => {
    let mockTrackTypeEnum = {
      trackType: 'criteria-kyc',
      formId: 'test1234',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockTrackTypeEnum);
    });
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(200);
  });
  test('return 200 case TrackTypeEnum = criteria-qa-cs', async () => {
    let mockTrackTypeEnum = {
      trackType: 'criteria-qa-cs',
      formId: 'test1234',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockTrackTypeEnum);
    });
    jest.spyOn(await CriteriaQaCsRepository, 'getOneFormWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, case default', async () => {
    let mockTrackTypeEnum = {
      trackType: 'default',
      formId: 'test1234',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockTrackTypeEnum);
    });
    jest.spyOn(await BadAnalysisFormRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(400);
  });
  // test('return status code 200', async () => {
  //   let mockData = {
  //     __v: 0,
  //     _id: '638071a8f4455b2ba66dc2d4',
  //     activated: false,
  //     agentEmail: 'agent02@bitkub.com',
  //     agentId: '6313b2a1849e6cca2c57505f',
  //     assignmentDateTime: 1669362000,
  //     createdAt: 1671643771,
  //     fileId: '638071a2f4455b2ba66dc2cf',
  //     fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
  //     fileSize: 2,
  //     fileType: 'voice',
  //     fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
  //     formId: '638070def4455b2ba66dc22c',
  //     groupId: '635987474b16253803502daa',
  //     groupName: 'New Authortity 3',
  //     netScore: null,
  //     qaAgentEmail: 'agentqa01@bitkub.com',
  //     qaAgentId: '624af91992655c203fa6851a',
  //     qaAgentName: 'agentqa01@bitkub.com',
  //     status: 'pending',
  //     taskNumber: 'TN-20221125-000001',
  //     trackType: 'criteria-kyc',
  //     varianceId: null,
  //     varianced: false,
  //   };
  //   jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve(mockData);
  //   });
  //   jest.spyOn(await CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   jest.spyOn(await EvaluateRepository, 'findOneByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).get('/:assignmentid');
  //   expect(response.statusCode).toEqual(200);
  // });
  test('return status code 500, assignment controller error something', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:assignmentid');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST', () => {
  test('return status code 400, payload for create assignment was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, assignment ready exit', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Error 400');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, create assignment fail, group not found', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, assignment cannot create because some field was wrong', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    let mockGroupsDbServicesData = {
      _id: '635987474b16253803502daa',
      createdAt: 1671643771,
      name: 'New Authortity 3',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await AssignmentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, create auditlogRepository success', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    let mockGroupsDbServicesData = {
      _id: '635987474b16253803502daa',
      createdAt: 1671643771,
      name: 'New Authortity 3',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await AssignmentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AssignmentRepository, 'addTaskNumber').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200, create auditlogRepository failed', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    let mockGroupsDbServicesData = {
      _id: '635987474b16253803502daa',
      createdAt: 1671643771,
      name: 'New Authortity 3',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await AssignmentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    jest.spyOn(await AssignmentRepository, 'addTaskNumber').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, assignment controller error something', async () => {
    let mockReq = {
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      trackType: 'criteria-kyc',
    };
    let mockGroupsDbServicesData = {
      _id: '635987474b16253803502daa',
      createdAt: 1671643771,
      name: 'New Authortity 3',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    jest.spyOn(await AssignmentRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AssignmentRepository, 'addTaskNumber').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test om medthod PATCH', () => {
  let mocklistQaAgentEmpty = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [],
    listOfFiles: [
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket01',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
    ],
  };
  let mockGenesis = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'voice',
        name: 'genesis',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
    ],
  };
  let mockCloudee = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'voice',
        name: 'cloudee',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
    ],
  };
  let mockFileNameWrong = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'voice',
        name: 'test',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
    ],
  };
  let mockTicket = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket01',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
      /* {
        fileId: null,
        type: 'ticket',
        name: 'ticket02',
        uri: null,
        size: 4,
        agentEmail: 'agent02@bitkub.com',
      }, */
    ],
  };
  let mockFileWrongFormat = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'test',
        name: 'ticket01',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
      {
        fileId: null,
        type: 'test',
        name: 'ticket02',
        uri: null,
        size: 50,
        agentEmail: 'agent02@bitkub.com',
      },
    ],
  };
  let mockReq = {
    formId: '630f6e3fba66c3d12763ac62',
    assignmentDateTime: 1662234000,
    listQaAgent: [
      {
        userId: '6236b84255b3320bd1642735',
        username: 'artronin2',
        email: 'thapakorn613@gmail.com',
        groupId: '630ce549787d3d156385c752',
      },
      {
        userId: '6236c72355b3320bd164273b',
        username: 'art123255555555555f',
        email: 'art@bitkub.com',
        groupId: '630ce549787d3d156385c752',
      },
    ],
    listOfFiles: [
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket01',
        uri: null,
        size: 4,
        agentEmail: 'agent01@bitkub.com',
      },
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket02',
        uri: null,
        size: 50,
        agentEmail: 'agent02@bitkub.com',
      },
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket03',
        uri: null,
        size: 3,
        agentEmail: 'agent03@bitkub.com',
      },
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket03',
        uri: null,
        size: 40,
        agentEmail: 'minnie.thirawat@bitkub.com',
      },
      {
        fileId: null,
        type: 'ticket',
        name: 'ticket03',
        uri: null,
        size: 15,
        agentEmail: 'agent04@bitkub.com',
      },
    ],
  };
  let mockAgentRepositoryResponse = {
    _id: '63ef236db42ce96fee3f0fbf',
    trackType: 'criteria-kyc',
    formId: '63da89d73cb35b764e7c381a',
    assignDate: '2023-02-17',
    assignmentDateTime: 1676616240,
    qaAgentId: '63dfb9e45e1fdf8ab5c31396',
    qaAgentName: 'ritzjane@gmail.com',
    qaAgentEmail: 'ritzjane@gmail.com',
    agentId: '63dbd5414ea1e9fd12af5e30',
    agentEmail: 'ritzjane@gmail.com',
    groupId: '63b72539aab0c589a9b6771c',
    groupName: 'jjjj',
    fileId: null,
    fileType: 'ticket',
    fileName: '88135',
    fileUri: null,
    fileSize: 1,
    activated: false,
    varianced: false,
    varianceId: null,
    status: 'completed',
    netScore: 100,
    completedDate: '2023-02-17T10:33:03.833Z',
    createdAt: 1676616557,
    updatedAt: 1676629983,
    __v: 0,
    taskNumber: 'TN-20230217-000081',
    evaluateId: '63ef57d160b1b5b368119cfb',
    evaluateStatus: 'completed',
    formData: {
      _id: '63da89d73cb35b764e7c381a',
      trackType: 'criteria-kyc',
      name: 'Criteria QA KYC roy test 555',
      targetScore: 100,
      concernIssues: [
        {
          value: 'test1',
          order: 1,
          _id: '63da89d73cb35b764e7c381b',
        },
      ],
      listQuestions: [
        {
          order: 1,
          title: 'communicate',
          detail: 'detail',
          nonFatal: false,
          weight: 100,
          listItems: [
            {
              detail: '',
              order: 1,
              title: 'test',
              _id: '63da89d73cb35b764e7c381e',
            },
          ],
          _id: '63da89d73cb35b764e7c381d',
        },
      ],
      actived: true,
      isDefaultForm: false,
      createdAt: 1675266519,
      updatedAt: 1675266519,
      __v: 0,
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
    },
    groupData: {
      _id: '63b72539aab0c589a9b6771c',
      name: 'jjjj',
      tag: 'jjjj',
      createdAt: 1672857703,
      updatedAt: null,
      __v: 0,
    },
  };
  test('return status code 400, list of qa agent can not empty', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/').send(mocklistQaAgentEmpty);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200, type = voice name = genesis', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/').send(mockGenesis);
    expect(response.statusCode).toEqual(200);
  });
  // test('return status code 200, type = voice name = cloudee', async () => {
  //   jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).patch('/').send(mockCloudee);
  //   expect(response.statusCode).toEqual(200);
  // });
  // test('return status code 400, type = voice name was wrong', async () => {
  //   jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).patch('/').send(mockFileNameWrong);
  //   expect(response.statusCode).toEqual(400);
  // });
  test('return status code 200, type = ticket', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/').send(mockTicket);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400, file format was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/').send(mockFileWrongFormat);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, agent not found', async () => {
    jest.spyOn(await AgentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PUT /:assignmentId', () => {
  test('return status code 400, payload for update assignment was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:assignmentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, assignment not found', async () => {
    let mockReq = {
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
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Fail');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, payload for update assignment was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:assignmentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      agentEmail: 'agentqa01@bitkub.com',
      status: 'pending',
      activated: false,
      varianced: false,
      varianceId: 'test',
    };
    let mockResData = {
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
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve({ _id: '1234' });
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve(mockResData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, assignment controller error something', async () => {
    let mockReq = {
      agentEmail: 'agentqa01@bitkub.com',
      status: 'pending',
      activated: false,
      varianced: false,
      varianceId: 'test',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve({ _id: '1234' });
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).put('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod PATCH /:assignmentId', () => {
  test('return status code 400, payload for update assignment was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:assignmentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, assignment not found', async () => {
    let mockReq = {
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
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Fail');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, payload for update assignment was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:assignmentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      agentEmail: 'agentqa01@bitkub.com',
      status: 'pending',
      activated: false,
      varianced: false,
      varianceId: 'test',
    };
    let mockResData = {
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
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve({ _id: '1234' });
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.resolve(mockResData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, assignment controller error something', async () => {
    let mockReq = {
      agentEmail: 'agentqa01@bitkub.com',
      status: 'pending',
      activated: false,
      varianced: false,
      varianceId: 'test',
    };
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve({ _id: '1234' });
    });
    jest.spyOn(await AssignmentRepository, 'updateAssignmentByIdWithObject').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).patch('/:assignmentId').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE', () => {
  test('return status code 400, assignment not found', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:assignmentId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 204', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Status 204');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:assignmentId');
    expect(response.statusCode).toEqual(204);
  });
  test('return status code 500, assignment controller error something', async () => {
    jest.spyOn(await AssignmentRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve('Status 204');
    });
    jest.spyOn(await AssignmentRepository, 'deleteAssignmentOne').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:assignmentId');
    expect(response.statusCode).toEqual(500);
  });
});
