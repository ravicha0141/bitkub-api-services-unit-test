require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { templateQuestionRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbTemplateQuestionModel = dbModels.templateQuestionModel;
const TemplateQuestionRepository = new templateQuestionRepository();

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
    jest.spyOn(dbTemplateQuestionModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateQuestionRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTemplateQuestionModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateQuestionRepository.getListByFilter('')).toEqual(false);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
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
    jest.spyOn(dbTemplateQuestionModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateQuestionRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbTemplateQuestionModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateQuestionRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbTemplateQuestionModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await TemplateQuestionRepository.create()).toEqual(bodyData);
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
    jest.spyOn(dbTemplateQuestionModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateQuestionRepository.update()).toEqual(mockReturnSuccessData);
  });
});

describe('delete function', () => {
  test('Test delete success', async () => {
    jest.spyOn(dbTemplateQuestionModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await TemplateQuestionRepository.delete()).toEqual(true);
  });
});
