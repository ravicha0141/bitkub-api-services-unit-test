require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
/* const db = require(path.resolve(`${dirname}/src/models/bik-models`));
const { evaluateService } = require('../../src/classes/db-services/index');

let dbEvaluates = db.evaluates;
const EvaluateService = new evaluateService(); */

const { evaluateModel } = require(path.resolve(`${dirname}/src/databases/models`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const EvaluateRepository = new repositoriesDb.evaluateRepository();

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
    jest.spyOn(evaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await EvaluateRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('findOneByFilter function', () => {
  test('Test find one by filter success', async () => {
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
    jest.spyOn(evaluateModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await EvaluateRepository.findOneByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(evaluateModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await EvaluateRepository.findOneByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(evaluateModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await EvaluateRepository.create()).toEqual(bodyData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(evaluateModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });
    let result;
    let error;

    try {
      result = await EvaluateRepository.create({ _id: 'id' });
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');

    //expect(await EvaluateRepository.create({ _id: 'id' })).toEqual(false);
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
    jest.spyOn(evaluateModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await EvaluateRepository.update()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(evaluateModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });

    let result;
    let error;

    try {
      result = await EvaluateRepository.update();
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');
    //expect(await EvaluateRepository.update()).toEqual(false);
  });
});

describe('updateByFilter function', () => {
  test('Test update by filter success', async () => {
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
    jest.spyOn(evaluateModel, 'updateOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await EvaluateRepository.updateByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(evaluateModel, 'updateOne').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });
    let result;
    let error;

    try {
      result = await EvaluateRepository.updateByFilter();
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');
    //expect(await EvaluateRepository.updateByFilter()).toEqual(false);
  });
});

describe('deleteOne function', () => {
  test('Test delete one success', async () => {
    const mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(evaluateModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await EvaluateRepository.deleteOne({ _id: '1234' })).toEqual(mockReturnFindById);
  });
  test('Test delete assignment < 0', async () => {
    let mockReturnDeleteOne = { deletedCount: 0 };
    jest.spyOn(evaluateModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnDeleteOne);
    });
    expect(await EvaluateRepository.deleteOne(null)).toEqual(mockReturnDeleteOne);
  });
  test('Test error catch case', async () => {
    const mockReturnFindById = undefined;
    jest.spyOn(evaluateModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await EvaluateRepository.deleteOne('')).toEqual(mockReturnFindById);
  });
});
