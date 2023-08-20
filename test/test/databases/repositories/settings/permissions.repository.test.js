require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { permissionRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbPermissionModel = dbModels.permissionModel;
const PermissionRepository = new permissionRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63388a5c669f47947e808084',
      createdAt: 1664649821,
      key: 'menuAgentProductivityAllowed',
      name: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbPermissionModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await PermissionRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbPermissionModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await PermissionRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63388a5c669f47947e808084',
      createdAt: 1664649821,
      key: 'menuAgentProductivityAllowed',
      name: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbPermissionModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await PermissionRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbPermissionModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await PermissionRepository.getListByFilter('')).toEqual([]);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbPermissionModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await PermissionRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63388a5c669f47947e808084',
      createdAt: 1664649821,
      key: 'menuAgentProductivityAllowed',
      name: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbPermissionModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await PermissionRepository.update()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbPermissionModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await PermissionRepository.update('')).toEqual(false);
  // });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbPermissionModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await PermissionRepository.deleteOne()).toEqual(true);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbPermissionModel, 'deleteOne').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await PermissionRepository.deleteOne('')).toEqual(false);
  // });
});
