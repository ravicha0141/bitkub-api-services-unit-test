require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { timeSettingRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbTimeSettingModel = dbModels.timeSettingModel;
const TimeSettingRepository = new timeSettingRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6324996008d4b267219ee4d3',
      actived: true,
      createdAt: 1663342944,
      fieldName: 'title',
      tag: 'title',
      type: 'string',
      updatedAt: null,
    };
    jest.spyOn(dbTimeSettingModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TimeSettingRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTimeSettingModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TimeSettingRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6324996008d4b267219ee4d3',
      actived: true,
      createdAt: 1663342944,
      fieldName: 'title',
      tag: 'title',
      type: 'string',
      updatedAt: null,
    };
    jest.spyOn(dbTimeSettingModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TimeSettingRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTimeSettingModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TimeSettingRepository.getListByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbTimeSettingModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await TimeSettingRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6324996008d4b267219ee4d3',
      actived: true,
      createdAt: 1663342944,
      fieldName: 'title',
      tag: 'title',
      type: 'string',
      updatedAt: null,
    };
    jest.spyOn(dbTimeSettingModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TimeSettingRepository.update()).toEqual(mockReturnSuccessData);
  });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbTimeSettingModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await TimeSettingRepository.deleteOne()).toEqual(true);
  });
});
