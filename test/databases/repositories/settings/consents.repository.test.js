require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { consentRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbConsentModel = dbModels.consentModel;
const ConsentRepository = new consentRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '633c4673dfc15c64762e2ba0',
      achieved: true,
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionKey: 'menuAgentProductivityAllowed',
          permissionName: 'settingMemu.agentProductivityAllowed',
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionKey: 'menuDailyTaskAllowed',
          permissionName: 'settingMemu.dailyTaskAllowed',
        },
      ],
      createdAt: 1671721774,
      groupId: '6334950ea72902c5f327a2b9',
      groupName: '',
      status: 'approved',
      updatedAt: null,
      userRequest: '',
    };
    jest.spyOn(dbConsentModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ConsentRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbConsentModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await ConsentRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '633c4673dfc15c64762e2ba0',
      achieved: true,
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionKey: 'menuAgentProductivityAllowed',
          permissionName: 'settingMemu.agentProductivityAllowed',
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionKey: 'menuDailyTaskAllowed',
          permissionName: 'settingMemu.dailyTaskAllowed',
        },
      ],
      createdAt: 1671721774,
      groupId: '6334950ea72902c5f327a2b9',
      groupName: '',
      status: 'approved',
      updatedAt: null,
      userRequest: '',
    };
    jest.spyOn(dbConsentModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ConsentRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbConsentModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await ConsentRepository.getListByFilter('')).toEqual([]);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbConsentModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await ConsentRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '633c4673dfc15c64762e2ba0',
      achieved: true,
      changeListts: [
        {
          _id: '63389e8c743095ee2246f6d9',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5c669f47947e808084',
          permissionKey: 'menuAgentProductivityAllowed',
          permissionName: 'settingMemu.agentProductivityAllowed',
        },
        {
          _id: '63389e8c743095ee2246f6dc',
          actived: false,
          groupId: '63389e8c743095ee2246f6d3',
          permissionId: '63388a5d669f47947e808086',
          permissionKey: 'menuDailyTaskAllowed',
          permissionName: 'settingMemu.dailyTaskAllowed',
        },
      ],
      createdAt: 1671721774,
      groupId: '6334950ea72902c5f327a2b9',
      groupName: '',
      status: 'approved',
      updatedAt: null,
      userRequest: '',
    };
    jest.spyOn(dbConsentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ConsentRepository.update()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbConsentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await ConsentRepository.update('')).toEqual(false);
  // });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbConsentModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await ConsentRepository.deleteOne()).toEqual(true);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbConsentModel, 'deleteOne').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await ConsentRepository.deleteOne('')).toEqual(false);
  // });
});
