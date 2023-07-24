require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');
const { agentModel } = require(path.resolve(`${__dir}/src/databases/models/`));
//const { agentServices } = require('../../src/classes/db-services');
const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
//const AgentRepository = new repositoriesDb.agentRepository();
//const AgentServices = new agentServices();
const AgentServices = new repositoriesDb.agentRepository();
afterEach(() => {
  jest.restoreAllMocks();
});

describe('getAll function', () => {
  test('Test get all data success', async () => {
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '63126994a45b9496d1b1f432',
        agentNumber: '000212',
        createdAt: 1671636605,
        email: 'minnie.thirawat@bitkub.com',
        employeeId: '111111',
        name: 'Minnie Thirawat',
        updatedAt: null,
        username: 'minnie.thirawat',
      },
    ];
    jest.spyOn(agentModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await AgentServices.getAll({
      _id: '63126994a45b9496d1b1f432'
    }))
    .toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await AgentServices.getAll({
      _id: {
        test: 'test'
      }
    })).toEqual(null);
  });

});

describe('getOneByFilter function', () => {
  test('Test get one data by filter success', async () => {
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '63126994a45b9496d1b1f432',
        agentNumber: '000212',
        createdAt: 1671636605,
        email: 'minnie.thirawat@bitkub.com',
        employeeId: '111111',
        name: 'Minnie Thirawat',
        updatedAt: null,
        username: 'minnie.thirawat',
      },
    ];
    jest.spyOn(agentModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await AgentServices.getOneByFilter({ _id: '63126994a45b9496d1b1f432' })).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await AgentServices.getOneByFilter({
       _id: {
        test: 'test'
      }
    })).toEqual(null);
  });
});

describe('checkAgentExist function', () => {
  test('Test get one data by filter success', async () => {
    jest.spyOn(agentModel, 'exists').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await AgentServices.checkAgentExist({ _id: '63126994a45b9496d1b1f432' })).toEqual(true);
  });
  test('Test error catch case', async () => {
    expect(await AgentServices.checkAgentExist({
       _id: {
        test: 'test'
      }
    })).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(agentModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await AgentServices.create()).toEqual(bodyData);
  });
});

describe('deleteOne function', () => {
  test('Test delete one data success', async () => {
    jest.spyOn(agentModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve('test');
    });
    expect(await AgentServices.deleteOne('63126994a45b9496d1b1f432')).toEqual('test');
  });
  test('Test error catch case', async () => {
    expect(await AgentServices.deleteOne({ _id: 'agentId' })).toEqual(null);
  });
});
