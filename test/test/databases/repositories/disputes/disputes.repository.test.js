require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
/* const db = require(path.resolve(`${dirname}/src/models/bik-models`));
const { disputeServices } = require('../../src/classes/db-services/index');

let dbDisputes = db.disputes;
const DisputeServices = new disputeServices(); */

const { disputeModel } = require(path.resolve(`${dirname}/src/databases/models`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const DisputeRepository = new repositoriesDb.disputeRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListOfDisputesByFilter function', () => {
  test('Test get list disputes by filter success', async () => {
    let mockReturnSuccessData = {
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
    jest.spyOn(disputeModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await DisputeRepository.getListOfDisputesByFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('getOneDisputeWithFilter function', () => {
  test('Test get one disputes with filter success', async () => {
    let mockReturnSuccessData = {
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
    jest.spyOn(disputeModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await DisputeRepository.getOneDisputeWithFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(disputeModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await DisputeRepository.getOneDisputeWithFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(disputeModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await DisputeRepository.create()).toEqual(bodyData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(disputeModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });
    let result;
    let error;

    try {
      result = await DisputeRepository.create({ _id: 'id' });
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');
  });
});

describe('updateWithObject function', () => {
  test('Test update group by object success', async () => {
    let mockReturnSuccessData = {
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
    jest.spyOn(disputeModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await DisputeRepository.updateWithObject()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(disputeModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });
    let result;
    let error;

    try {
      result = await DisputeRepository.updateWithObject();
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');
  });
});

describe('deleteDisputeOne function', () => {
  test('Test delete group data success', async () => {
    jest.spyOn(disputeModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await DisputeRepository.deleteDisputeOne('id')).toEqual(true);
  });
  test('Test error catch case', async () => {
    jest.spyOn(disputeModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.reject('saveError');
    });
    let result;
    let error;

    try {
      result = await DisputeRepository.deleteDisputeOne({ _id: 'id' });
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual('saveError');
  });
});
