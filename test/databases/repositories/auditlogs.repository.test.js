require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');
/* const db = require(path.resolve(`${__dir}/src/databases/models/`));
const { auditlogServices } = require('../../src/classes/db-services');

let dbAuditlogs = db.auditlogs;
let dbAgents = db.agents;
const AuditlogServices = new auditlogServices();
 */
const { auditlogModel, agentModel } = require(path.resolve(`${__dir}/src/databases/models/`));
const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const AuditlogRepository = new repositoriesDb.auditlogRepository();
const AgentRepository = new repositoriesDb.agentRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

const mockReturnSuccessDataList = [
  {
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
  }
];

describe('getAll function', () => {
  test('Test get all data success', async () => {
    jest.spyOn(auditlogModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessDataList);
    });
    expect(await AuditlogRepository.getAll()).toEqual(mockReturnSuccessDataList);
  });
  test('Test error catch case', async () => {
    jest.spyOn(auditlogModel, 'find').mockImplementationOnce(() => {
      return Promise.reject(undefined);
    });
    expect(await AuditlogRepository.getAll()).toEqual(0);
  });
});


describe('getOneByFilter function', () => {
  test('should return data success', async () => {
    const mockReturnSuccessData = mockReturnSuccessDataList[0] || {};
    jest.spyOn(auditlogModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AuditlogRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('should be handle error', async () => {
    jest.spyOn(auditlogModel, 'findOne').mockImplementationOnce(() => {
      return Promise.reject(undefined);
    });
    expect(await AuditlogRepository.getOneByFilter()).toEqual(false);
  });
});

describe('getListByFilter function', () => {
  test('should return data success', async () => {
    jest.spyOn(auditlogModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessDataList);
    });
    expect(await AuditlogRepository.getListByFilter()).toEqual(mockReturnSuccessDataList);
  });
});

describe('create function', () => {
  test('should create and return data success', async () => {
    const mockReturnSuccessData = mockReturnSuccessDataList[0] || {};
    jest.spyOn(auditlogModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AuditlogRepository.create()).toEqual(mockReturnSuccessData);
  });
});

describe('findByIdAndUpdateById function', () => {
  test('should find data and update success', async () => {
    const mockReturnSuccessData = mockReturnSuccessDataList[0] || {};
    jest.spyOn(auditlogModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AuditlogRepository.findByIdAndUpdateById()).toEqual(mockReturnSuccessData);
  });
});

describe('deleteOne function', () => {
  test('should delete data success', async () => {
    const mockReturnSuccessData = true;
    jest.spyOn(auditlogModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AuditlogRepository.deleteOne('637ba33e367cb01d3258bf0b')).toEqual(mockReturnSuccessData);
  });
  test('should be return null', async () => {
    expect(await AuditlogRepository.deleteOne('test')).toEqual(null);
  });
});