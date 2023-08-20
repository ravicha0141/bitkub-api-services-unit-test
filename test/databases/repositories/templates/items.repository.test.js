require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { templateItemRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbItemOfTemplateModel = dbModels.itemOfTemplateModel;
const TemplateItemRepository = new templateItemRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '639161ac2a66d5ce86f624cb',
      createdAt: 1671724308,
      detail: '1',
      questionId: '639161ac2a66d5ce86f624c7',
      templateId: '637f9bc3f4455b2ba66d7531',
      title: '1',
      updatedAt: null,
      weight: 10,
    };
    jest.spyOn(dbItemOfTemplateModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateItemRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbItemOfTemplateModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateItemRepository.getListByFilter('')).toEqual([]);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '639161ac2a66d5ce86f624cb',
      createdAt: 1671724308,
      detail: '1',
      questionId: '639161ac2a66d5ce86f624c7',
      templateId: '637f9bc3f4455b2ba66d7531',
      title: '1',
      updatedAt: null,
      weight: 10,
    };
    jest.spyOn(dbItemOfTemplateModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateItemRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbItemOfTemplateModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await TemplateItemRepository.getOneByFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbItemOfTemplateModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await TemplateItemRepository.create()).toEqual(bodyData);
  });
  // test('Test error catch case', async () => {
  //   jest.spyOn(dbItemOfTemplateModel.prototype, 'save').mockImplementationOnce(() => {
  //     return Promise.reject(false);
  //   });
  //   expect(await TemplateItemRepository.create({ _id: 'id' })).toEqual(false);
  // });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '639161ac2a66d5ce86f624cb',
      createdAt: 1671724308,
      detail: '1',
      questionId: '639161ac2a66d5ce86f624c7',
      templateId: '637f9bc3f4455b2ba66d7531',
      title: '1',
      updatedAt: null,
      weight: 10,
    };
    jest.spyOn(dbItemOfTemplateModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await TemplateItemRepository.update()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbItemOfTemplateModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await TemplateItemRepository.update('')).toEqual(false);
  // });
});

describe('removeItem function', () => {
  test('Test remove Item success', async () => {
    jest.spyOn(dbItemOfTemplateModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await TemplateItemRepository.removeItem()).toEqual(true);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbItemOfTemplateModel, 'deleteOne').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await TemplateItemRepository.removeItem('')).toEqual(false);
  // });
});
