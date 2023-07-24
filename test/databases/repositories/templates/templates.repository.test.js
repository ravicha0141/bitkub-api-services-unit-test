require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { templateRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbTemplatesModel = dbModels.templateModel;
const TemplateRepository = new templateRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '639161ad2a66d5ce86f624ce',
      createdAt: 1671724752,
      detail: 'test',
      templateId: '637f9bc3f4455b2ba66d7531',
      title: 'question 2',
      updatedAt: null,
      weight: 10,
    };
    jest.spyOn(dbTemplatesModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTemplatesModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateRepository.getListByFilter('')).toEqual([]);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f9bc3f4455b2ba66d752d',
      actived: true,
      createdAt: 1669307331,
      defaultFormId: '63961f2a1fcd459caccacaa9',
      tag: 'bad-analysis',
      targetScore: 101,
      title: 'Bad Analysis',
      updatedAt: null,
    };
    jest.spyOn(dbTemplatesModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTemplatesModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbTemplatesModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await TemplateRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '639161ad2a66d5ce86f624ce',
      createdAt: 1671724752,
      detail: 'test',
      templateId: '637f9bc3f4455b2ba66d7531',
      title: 'question 2',
      updatedAt: null,
      weight: 10,
    };
    jest.spyOn(dbTemplatesModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateRepository.update()).toEqual(mockReturnSuccessData);
  });
});
