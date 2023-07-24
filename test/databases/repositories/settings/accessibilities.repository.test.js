require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { accessibilitieRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbAccessManagementModel = dbModels.accessManagementModel;
const AccessibilitieRepository = new accessibilitieRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6338983ca87d93a87d24e0b4',
      actived: true,
      createdAt: 1664653372,
      groupId: '6334950ea72902c5f327a2b9',
      permissionId: '63388a5c669f47947e808084',
      permissionKey: 'menuAgentProductivityAllowed',
      permissionName: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbAccessManagementModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AccessibilitieRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbAccessManagementModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await AccessibilitieRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6338983ca87d93a87d24e0b4',
      actived: true,
      createdAt: 1664653372,
      groupId: '6334950ea72902c5f327a2b9',
      permissionId: '63388a5c669f47947e808084',
      permissionKey: 'menuAgentProductivityAllowed',
      permissionName: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbAccessManagementModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AccessibilitieRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbAccessManagementModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await AccessibilitieRepository.getListByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbAccessManagementModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await AccessibilitieRepository.create()).toEqual(bodyData);
  });
});

describe('createMany function', () => {
  test('Test create Many success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbAccessManagementModel, 'insertMany').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await AccessibilitieRepository.createMany()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6338983ca87d93a87d24e0b4',
      actived: true,
      createdAt: 1664653372,
      groupId: '6334950ea72902c5f327a2b9',
      permissionId: '63388a5c669f47947e808084',
      permissionKey: 'menuAgentProductivityAllowed',
      permissionName: 'settingMemu.agentProductivityAllowed',
      updatedAt: null,
    };
    jest.spyOn(dbAccessManagementModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AccessibilitieRepository.update()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbAccessManagementModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await AccessibilitieRepository.update('')).toEqual(false);
  // });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbAccessManagementModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await AccessibilitieRepository.deleteOne()).toEqual(true);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbAccessManagementModel, 'findOneAndDelete').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await AccessibilitieRepository.deleteOne('')).toEqual(false);
  // });
});
