require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { resultEvaluateOfBadAnalysisRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbResultEvaluateOfBadAnalysis = dbModels.resultEvaluateOfBadAnalysis;
const ResultEvaluateOfBadAnalysisRepository = new resultEvaluateOfBadAnalysisRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get list by filter success', async () => {
    let mockReturnSuccessData = {
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
      fileType: 'ticket',
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
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'find').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.getListByFilter('')).toEqual([]);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
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
      fileType: 'ticket',
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
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'findOne').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbResultEvaluateOfBadAnalysis.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
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
      fileType: 'ticket',
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
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.update()).toEqual(mockReturnSuccessData);
  });
});

describe('removeItem function', () => {
  test('Test remove Item success', async () => {
    const mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.removeItem({ _id: '1234' })).toEqual(mockReturnFindById);
  });
});

describe('removeItemMany function', () => {
  test('Test remove Item Many success', async () => {
    const mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbResultEvaluateOfBadAnalysis, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await ResultEvaluateOfBadAnalysisRepository.removeItemMany({ _id: '1234' })).toEqual(mockReturnFindById);
  });
});
