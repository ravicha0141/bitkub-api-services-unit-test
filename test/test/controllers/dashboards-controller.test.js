const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const dashboardController = require(path.resolve(`${dirname}/src/controllers/dashboards.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const DashboardRepository = new repositoriesDb.dashboardRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
let router = dashboardController({
  userRepository: UserRepository,
  memberRepository: MemberRepository,
  auditlogRepository: AuditlogRepository,
  dashboardRepository: DashboardRepository,
  assignmentRepository: AssignmentRepository,
});
let mockevaluateStarted = [
  {
    _id: '637d9a4b25f403e27a5c7597',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-started',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '637d1ad6b839d958ccc03a4b',
      taskNumber: 'TN-20221123-000006',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'bad-analysis',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637d1ad3b839d958ccc03a46',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669175882,
      netScore: null,
      monitoringTime: 1669175882,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'inprogress',
      result: '',
      _id: '637d9a4b25f403e27a5c7594',
      __v: 0,
    },
    __v: 0,
    createdAt: 1669175883,
    date: '2022-11-23',
    updatedAt: 1677089522,
  },
  {
    _id: '637d9ab725f403e27a5c75dc',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-started',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '637d1815b839d958ccc03529',
      taskNumber: 'TN-20221123-000005',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'bad-analysis',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637d1813b839d958ccc03524',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669175990,
      netScore: null,
      monitoringTime: 1669175990,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'inprogress',
      result: '',
      _id: '637d9ab725f403e27a5c75d9',
      __v: 0,
    },
    __v: 0,
    createdAt: 1669175991,
    date: '2022-11-23',
    updatedAt: 1677089522,
  },
  {
    _id: '637dc25525f403e27a5c864f',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-started',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '637dc24b25f403e27a5c8611',
      taskNumber: 'TN-20221123-000007',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'bad-analysis',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637dc24825f403e27a5c860c',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669186132,
      netScore: null,
      monitoringTime: 1669186132,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'inprogress',
      result: '',
      _id: '637dc25525f403e27a5c864c',
      __v: 0,
    },
    __v: 0,
    createdAt: 1669186133,
    date: '2022-11-23',
    updatedAt: 1677089522,
  },
];
let mockevaluateCompleted = [
  {
    _id: '637d9ac725f403e27a5c75f8',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-completed',
    processTime: 16,
    reason: '',
    tag: '',
    properties: {
      _id: '637d9ab725f403e27a5c75d9',
      assignmentId: '637d1815b839d958ccc03529',
      taskNumber: 'TN-20221123-000005',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'bad-analysis',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637d1813b839d958ccc03524',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669175990,
      netScore: null,
      monitoringTime: 1669175990,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'completed',
      result: '',
      __v: 0,
      createdAt: 1669175991,
      date: '2022-11-23',
    },
    __v: 0,
    createdAt: 1669176007,
    date: '2022-11-23',
    updatedAt: 1677089573,
  },
  {
    _id: '637dc27325f403e27a5c865a',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-completed',
    processTime: 30,
    reason: '',
    tag: '',
    properties: {
      _id: '637dc25525f403e27a5c864c',
      assignmentId: '637dc24b25f403e27a5c8611',
      taskNumber: 'TN-20221123-000007',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'bad-analysis',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637dc24825f403e27a5c860c',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 0,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669186132,
      netScore: null,
      monitoringTime: 1669186132,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'completed',
      result: '',
      __v: 0,
      createdAt: 1669186133,
      date: '2022-11-23',
    },
    __v: 0,
    createdAt: 1669186163,
    date: '2022-11-23',
    updatedAt: 1677089573,
  },
  {
    _id: '637dc45025f403e27a5c8803',
    userId: '624af91992655c203fa6851a',
    service: 'evaluate',
    action: 'evaluate-completed',
    processTime: 19,
    reason: '',
    tag: '',
    properties: {
      _id: '637dc43d25f403e27a5c87f9',
      assignmentId: '637dc35425f403e27a5c8734',
      taskNumber: 'TN-20221123-000008',
      assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      trackType: 'qa-kyc',
      agentId: '6313b2a1849e6cca2c57505f',
      agentEmail: 'agent02@bitkub.com',
      agentName: '',
      agentEmployeeId: '',
      groupId: '635987474b16253803502daa',
      fileId: '637dc35125f403e27a5c872f',
      fileType: 'voice',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
      targetScore: 100,
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentEmail: 'agentqa01@bitkub.com',
      monitoringDate: 1669186620,
      netScore: 90,
      monitoringTime: 1669186620,
      areaOfStrength: '',
      areaOfImprovement: '',
      note: '',
      internalNote: '',
      isDispute: false,
      status: 'completed',
      result: '',
      __v: 0,
      createdAt: 1669186621,
      date: '2022-11-23',
    },
    __v: 0,
    createdAt: 1669186640,
    date: '2022-11-23',
    updatedAt: 1677089573,
  },
];
let mockdisputeCreated = [
  {
    _id: '637f7d54915b414a66d24555',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-created',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '637f216e915b414a66d20043',
      evaluateId: '637f217b915b414a66d2007a',
      taskNumber: 'TN-20221124-000005',
      agentEmail: 'agent02@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assist01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1669222800,
      qaReason: '',
      qaReasonDate: null,
      disputeStatus: 'pending',
      dateOfMonitoring: 1669222800,
      _id: '637f7d54915b414a66d24553',
      __v: 0,
    },
    __v: 0,
    createdAt: 1669299540,
    date: '2022-11-24',
    updatedAt: 1677089272,
  },
  {
    _id: '63920a9805c39ba1f4768286',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-created',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      taskNumber: 'TN-20221208-000003',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      qaReason: '',
      qaReasonDate: null,
      disputeStatus: 'pending',
      dateOfMonitoring: 1670432400,
      _id: '63920a9805c39ba1f4768284',
      __v: 0,
    },
    __v: 0,
    createdAt: 1670515352,
    date: '2022-12-08',
    updatedAt: 1677089272,
  },
  {
    _id: '6393aba336aa281217256612',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-created',
    reason: '',
    tag: '',
    properties: {
      assignmentId: '63929ac936aa28121724b442',
      evaluateId: '63929ada36aa28121724b482',
      taskNumber: 'TN-20221209-000006',
      agentEmail: 'agent02@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assist01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670605200,
      qaReason: '',
      qaReasonDate: null,
      disputeStatus: 'pending',
      dateOfMonitoring: 1670518800,
      _id: '6393aba336aa281217256610',
      __v: 0,
    },
    __v: 0,
    createdAt: 1670622115,
    date: '2022-12-10',
    updatedAt: 1677089272,
  },
];
let mockdisputeCompleted = [
  {
    _id: '637f7db0915b414a66d245a3',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-completed',
    reason: '',
    tag: '',
    properties: {
      _id: '637f7d54915b414a66d24553',
      assignmentId: '637f216e915b414a66d20043',
      evaluateId: '637f217b915b414a66d2007a',
      taskNumber: 'TN-20221124-000005',
      agentEmail: 'agent02@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assist01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1669222800,
      qaReason: 'test',
      qaReasonDate: 1669222800,
      disputeStatus: 'agreed',
      dateOfMonitoring: 1669222800,
      __v: 0,
    },
    __v: 0,
    createdAt: 1669299632,
    date: '2022-11-24',
    updatedAt: 1677089307,
  },
  {
    _id: '63922812efcd74cada003a41',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-completed',
    reason: '',
    tag: '',
    properties: {
      _id: '63920a9805c39ba1f4768284',
      assignmentId: '639116130f42d390e69b1e68',
      evaluateId: '639116190f42d390e69b1eb6',
      taskNumber: 'TN-20221208-000003',
      agentEmail: 'minnie.thirawat@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assisttest01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670432400,
      qaReason: 'testt',
      qaReasonDate: 1670518800,
      disputeStatus: 'agreed',
      dateOfMonitoring: 1670432400,
      __v: 0,
    },
    __v: 0,
    createdAt: 1670522898,
    date: '2022-12-09',
    updatedAt: 1677089307,
  },
  {
    _id: '6393ac7836aa28121725679e',
    userId: 'agentqa01@bitkub.com',
    service: 'dispute',
    action: 'dispute-completed',
    reason: '',
    tag: '',
    properties: {
      _id: '6393aba336aa281217256610',
      assignmentId: '63929ac936aa28121724b442',
      evaluateId: '63929ada36aa28121724b482',
      taskNumber: 'TN-20221209-000006',
      agentEmail: 'agent02@bitkub.com',
      qaAgent: 'agentqa01@bitkub.com',
      groupId: '635987474b16253803502daa',
      superVisorEmail: 'assist01@bitkub.com',
      agentReason: 'test',
      agentReasonDate: 1670605200,
      qaReason: 'testpss',
      qaReasonDate: 1670605200,
      disputeStatus: 'agreed',
      dateOfMonitoring: 1670518800,
      __v: 0,
    },
    __v: 0,
    createdAt: 1670622328,
    date: '2022-12-10',
    updatedAt: 1677089307,
  },
];


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /total-task', () => {
  let mockReturnAssignmentData = [
    {
      _id: '63eefbb6b6571c4a2a86a9b8',
      trackType: 'criteria-kyc',
      formId: '63961ee9ac9613ef718acbe6',
      assignDate: '2023-02-17',
      assignmentDateTime: 1676606220,
      qaAgentId: '63a32444f8006663a8a4c2f8',
      qaAgentName: 'qa01@bitkub.com',
      qaAgentEmail: 'qa01@bitkub.com',
      agentId: '63126994a45b9496d1b1f432',
      agentEmail: 'minnie.thirawat@bitkub.com',
      groupId: '63b72539aab0c589a9b6771c',
      groupName: 'jjjj',
      fileId: '63eefbb2b6571c4a2a86a9b3',
      fileType: 'voice',
      fileName: '20220824_191327_714_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a22.mp3',
      fileUri:
        'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2023-02-17/bitqast-0d590984-beb1-478a-ae24-ee7a667f04ef_20220824_191327_714_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a22.mp3',
      fileSize: 198,
      activated: false,
      varianced: false,
      varianceId: null,
      status: 'completed',
      netScore: 50,
      completedDate: '2023-02-17T06:33:13.711Z',
      createdAt: 1676606390,
      updatedAt: 1676615593,
      __v: 0,
      taskNumber: 'TN-20230217-000072',
    },
    {
      _id: '63ef0074b42ce96fee3ef4d3',
      trackType: 'criteria-qa-cs',
      formId: '63e3de296d8a39dbebe5e680',
      assignDate: '2023-02-17',
      assignmentDateTime: 1676607540,
      qaAgentId: '63dfb9e45e1fdf8ab5c31396',
      qaAgentName: 'ritzjane@gmail.com',
      qaAgentEmail: 'ritzjane@gmail.com',
      agentId: '63dbd5414ea1e9fd12af5e30',
      agentEmail: 'ritzjane@gmail.com',
      groupId: '63b72539aab0c589a9b6771c',
      groupName: 'jjjj',
      fileId: null,
      fileType: 'ticket',
      fileName: '8835',
      fileUri: null,
      fileSize: 1,
      activated: false,
      varianced: false,
      varianceId: null,
      status: 'completed',
      netScore: null,
      completedDate: '2023-02-17T06:48:31.117Z',
      createdAt: 1676607604,
      updatedAt: 1676616511,
      __v: 0,
      taskNumber: 'TN-20230217-000073',
    },
    {
      _id: '63ef0074b42ce96fee3ef4db',
      trackType: 'criteria-qa-cs',
      formId: '63e3de296d8a39dbebe5e680',
      assignDate: '2023-02-17',
      assignmentDateTime: 1676607540,
      qaAgentId: '63dfb9e45e1fdf8ab5c31396',
      qaAgentName: 'ritzjane@gmail.com',
      qaAgentEmail: 'ritzjane@gmail.com',
      agentId: '63dbd5414ea1e9fd12af5e30',
      agentEmail: 'ritzjane@gmail.com',
      groupId: '63b72539aab0c589a9b6771c',
      groupName: 'jjjj',
      fileId: null,
      fileType: 'ticket',
      fileName: '88835',
      fileUri: null,
      fileSize: 1,
      activated: false,
      varianced: false,
      varianceId: null,
      status: 'inprogress',
      netScore: null,
      completedDate: null,
      createdAt: 1676607604,
      updatedAt: 1676608821,
      __v: 0,
      taskNumber: 'TN-20230217-000074',
    },
  ];
  let mockReturnAuditData = [
    {
      _id: '637dc27325f403e27a5c865a',
      userId: '624af91992655c203fa6851a',
      service: 'evaluate',
      action: 'evaluate-completed',
      processTime: 30,
      reason: '',
      tag: '',
      properties: {
        _id: '637dc25525f403e27a5c864c',
        assignmentId: '637dc24b25f403e27a5c8611',
        taskNumber: 'TN-20221123-000007',
        assignmentRef: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
        trackType: 'bad-analysis',
        agentId: '6313b2a1849e6cca2c57505f',
        agentEmail: 'agent02@bitkub.com',
        agentName: '',
        agentEmployeeId: '',
        groupId: '635987474b16253803502daa',
        fileId: '637dc24825f403e27a5c860c',
        fileType: 'voice',
        fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a24.wav',
        targetScore: 0,
        qaAgentId: '624af91992655c203fa6851a',
        qaAgentEmail: 'agentqa01@bitkub.com',
        monitoringDate: 1669186132,
        netScore: null,
        monitoringTime: 1669186132,
        areaOfStrength: '',
        areaOfImprovement: '',
        note: '',
        internalNote: '',
        isDispute: false,
        status: 'completed',
        result: '',
        __v: 0,
        createdAt: 1669186133,
        date: '2023-02-23',
      },
      __v: 0,
      createdAt: 1669186163,
      date: '2023-02-23',
      updatedAt: 1677087338,
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await AssignmentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockReturnAssignmentData);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockReturnAuditData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/total-task');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AssignmentRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/total-task');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /dispute-task', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockdisputeCreated);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockdisputeCompleted);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/dispute-task');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/dispute-task');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /process-lists', () => {
  test('return status code 200', async () => {
    let mockDashboardResponse = {
      __v: 0,
      _id: '637f917c5c133957a940cb72',
      archived: true,
      createdAt: 1669304700,
      date: '2022-11-24',
      key: '09:00:00-10:00:00',
      properties: {
        amount: 3,
        endedFormat: '10:00:00',
        endedUnix: 1669258800,
        groupId: '6341c612baf1d9eafd9dfbeb',
        startedFormat: '09:00:00',
        startedUnix: 1669255200,
      },
      tag: 'process-lists',
      updatedAt: null,
    };
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateStarted);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateCompleted);
    });
    jest.spyOn(await DashboardRepository, 'getOneByFilter').mockResolvedValue(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockResolvedValue(async () => {
      return Promise.resolve('Success');
    });
    /* jest.spyOn(await UserRepository, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    })); */
    jest.spyOn(await DashboardRepository, 'create').mockResolvedValue(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/process-lists');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/process-lists');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /summary-process', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateCompleted);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateStarted);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateCompleted);
    });
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mockevaluateStarted);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/summary-process');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/summary-process');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /agent-status-hc', () => {
  let mockData = [
    {
      _id: '637ba9252f3d902e82bca128',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '1',
      properties: {
        qaAgentId: '624af91992655c203fa6851a',
        qaAgentEmail: 'agentqa01@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-21',
        status: true,
        startTime: 1669014900,
        endTime: 0,
        amount: 0,
        _id: '637ba9252f3d902e82bca125',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669014900,
      date: '2022-11-21',
      updatedAt: 1677309679,
    },
    {
      _id: '637ba9972f3d902e82bca183',
      userId: '62372f2229001d280317d04a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '2',
      properties: {
        _id: '637ba33e367cb01d3258bf08',
        qaAgentId: '62372f2229001d280317d04a',
        qaAgentEmail: 'agent1@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-21',
        status: true,
        startTime: 1669012200,
        endTime: 0,
        amount: 1495,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669012200,
      date: '2022-11-21',
      updatedAt: 1677309679,
    },
    {
      _id: '637ca9ab4bc79e8e5405e41c',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '2',
      properties: {
        qaAgentId: '624af91992655c203fa6851a',
        qaAgentEmail: 'agentqa01@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-22',
        status: true,
        startTime: 1669114283,
        endTime: 0,
        amount: 0,
        _id: '637ca9ab4bc79e8e5405e419',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669114283,
      date: '2022-11-22',
      updatedAt: 1677309679,
    },
    {
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
      updatedAt: 1677309705,
    },
    {
      _id: '637d54de25f403e27a5c57d3',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-ended',
      reason: '',
      tag: '2',
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
        endTime: 1669158110,
        amount: 18477,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669158110,
      date: '2022-11-23',
      updatedAt: 1677309705,
    },
    {
      _id: '637dfbb640416785931c5034',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-ended',
      reason: '',
      tag: '3',
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
        endTime: 1669200822,
        amount: 61189,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669200822,
      date: '2022-11-23',
      updatedAt: 1677309705,
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agent-status-hc');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/agent-status-hc');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /available-hc', () => {
  let mockData = [
    {
      _id: '637ba9252f3d902e82bca128',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '1',
      properties: {
        qaAgentId: '624af91992655c203fa6851a',
        qaAgentEmail: 'agentqa01@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-21',
        status: true,
        startTime: 1669014900,
        endTime: 0,
        amount: 0,
        _id: '637ba9252f3d902e82bca125',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669014900,
      date: '2022-11-21',
      updatedAt: 1677309679,
    },
    {
      _id: '637ba9972f3d902e82bca183',
      userId: '62372f2229001d280317d04a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '2',
      properties: {
        _id: '637ba33e367cb01d3258bf08',
        qaAgentId: '62372f2229001d280317d04a',
        qaAgentEmail: 'agent1@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-21',
        status: true,
        startTime: 1669012200,
        endTime: 0,
        amount: 1495,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669012200,
      date: '2022-11-21',
      updatedAt: 1677309679,
    },
    {
      _id: '637ca9ab4bc79e8e5405e41c',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-started',
      reason: '',
      tag: '2',
      properties: {
        qaAgentId: '624af91992655c203fa6851a',
        qaAgentEmail: 'agentqa01@bitkub.com',
        groupId: '6335a4bfa72902c5f329a82a',
        groupName: 'check member',
        type: 'on-duty',
        date: '2022-11-22',
        status: true,
        startTime: 1669114283,
        endTime: 0,
        amount: 0,
        _id: '637ca9ab4bc79e8e5405e419',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669114283,
      date: '2022-11-22',
      updatedAt: 1677309679,
    },
    {
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
      updatedAt: 1677309705,
    },
    {
      _id: '637d54de25f403e27a5c57d3',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-ended',
      reason: '',
      tag: '2',
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
        endTime: 1669158110,
        amount: 18477,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669158110,
      date: '2022-11-23',
      updatedAt: 1677309705,
    },
    {
      _id: '637dfbb640416785931c5034',
      userId: '624af91992655c203fa6851a',
      service: 'progression',
      action: 'onduty-ended',
      reason: '',
      tag: '3',
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
        endTime: 1669200822,
        amount: 61189,
        __v: 0,
      },
      __v: 0,
      createdAt: 1669200822,
      date: '2022-11-23',
      updatedAt: 1677309705,
    },
  ];
  let mockUserData = [
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
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    jest.spyOn(await UserRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockUserData);
    });
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/available-hc');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getListByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/available-hc');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /assignment-created', () => {
  let mcokData = [
    {
      _id: '637d008aeda9560f59d4eb14',
      userId: '6330099af6286b8c25963a2e',
      service: 'assignment',
      action: 'assignment-created',
      reason: '',
      tag: '',
      properties: {
        trackType: 'qa-cs-evaluation',
        formId: '637ce32ac98c4da207237380',
        assignmentDateTime: 1669136460,
        qaAgentId: '6330099af6286b8c25963a2e',
        qaAgentName: 'qaagent003@bitkub.com',
        qaAgentEmail: 'qaagent003@bitkub.com',
        agentId: '6313b2a1849e6cca2c57505f',
        agentEmail: 'agent02@bitkub.com',
        groupId: '6357fec09215d84125524a1c',
        groupName: 'New Authortity 2',
        fileId: '637d0084eda9560f59d4eaf1',
        fileType: 'voice',
        fileName: '20220828_191327_000002_66940422550_9df21e27-3c35-41e6-b932-fb63f2b11a12_15f563c4-3ce2-4e44-a33f-3fde99191666.wav',
        fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-23/bitqast-b7382f9e-7bd5-45c1-80b5-c189c88abd16.wav',
        fileSize: 2,
        activated: false,
        status: 'pending',
        netScore: null,
        _id: '637d008aeda9560f59d4eb12',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669136522,
      date: '2022-11-23',
      updatedAt: 1677310143,
    },
    {
      _id: '637d00bfeda9560f59d4eb71',
      userId: '6330099af6286b8c25963a2e',
      service: 'assignment',
      action: 'assignment-created',
      reason: '',
      tag: '',
      properties: {
        trackType: 'bad-analysis',
        formId: '637c4c914bc79e8e5405b8a4',
        assignmentDateTime: 1669136520,
        qaAgentId: '6330099af6286b8c25963a2e',
        qaAgentName: 'qaagent003@bitkub.com',
        qaAgentEmail: 'qaagent003@bitkub.com',
        agentId: '6313b2a1849e6cca2c57505f',
        agentEmail: 'agent02@bitkub.com',
        groupId: '6357fec09215d84125524a1c',
        groupName: 'New Authortity 2',
        fileId: '637d00bceda9560f59d4eb6a',
        fileType: 'voice',
        fileName: '20220828_191327_000002_66940422550_9df21e27-3c35-41e6-b932-fb63f2b11a12_15f563c4-3ce2-4e44-a33f-3fde99191666.wav',
        fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-23/bitqast-a866aef7-4a5a-457b-b54c-75b76cff6266.wav',
        fileSize: 2,
        activated: false,
        status: 'pending',
        netScore: null,
        _id: '637d00bfeda9560f59d4eb6f',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669136575,
      date: '2022-11-23',
      updatedAt: 1677310143,
    },
    {
      _id: '637d0573655249e7289bfe77',
      userId: '6330099af6286b8c25963a2e',
      service: 'assignment',
      action: 'assignment-created',
      reason: '',
      tag: '',
      properties: {
        trackType: 'qa-cs-evaluation',
        formId: '637ce32ac98c4da207237380',
        assignmentDateTime: 1669137720,
        qaAgentId: '6330099af6286b8c25963a2e',
        qaAgentName: 'qaagent003@bitkub.com',
        qaAgentEmail: 'qaagent003@bitkub.com',
        agentId: '6313b298849e6cca2c57505c',
        agentEmail: 'agent01@bitkub.com',
        groupId: '6357fec09215d84125524a1c',
        groupName: 'New Authortity 2',
        fileId: '637d056f655249e7289bfe70',
        fileType: 'voice',
        fileName: '20220824_191327_000001_66940422550_9df21e27-3c35-41e6-b932-fb63f2b11a12_15f563c4-3ce2-4e44-a33f-3fde99191666 copy 2.mp3',
        fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-23/bitqast-dde6e2a9-0d8a-463c-8795-d71be7844da2.mp3',
        fileSize: 198,
        activated: false,
        status: 'pending',
        netScore: null,
        _id: '637d0573655249e7289bfe75',
        __v: 0,
      },
      __v: 0,
      createdAt: 1669137779,
      date: '2022-11-23',
      updatedAt: 1677310143,
    },
  ];
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve(mcokData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/assignment-created');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/assignment-created');
    expect(response.statusCode).toEqual(500);
  });
});
