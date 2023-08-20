require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { criteriaQaCsItemQuestionRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbCriteriaQacsItemModel = dbModels.criteriaQacsItemModel;
const CriteriaQaCsItemQuestionRepository = new criteriaQaCsItemQuestionRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = [
      {
        _id: 'data _id',
        formId: 'data formId',
        title: 'data title',
        weight: 'data weight',
        detail: 'data detail',
        listQuestions: [{ questionTitle: 'data questionTitle' }],
        __v: 0,
      },
    ];
    jest.spyOn(dbCriteriaQacsItemModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsItemQuestionRepository.getListByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await CriteriaQaCsItemQuestionRepository.getListByFilter('')).toEqual(null);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = [
      {
        _id: 'data _id',
        formId: 'data formId',
        title: 'data title',
        weight: 'data weight',
        detail: 'data detail',
        listQuestions: [{ questionTitle: 'data questionTitle' }],
        __v: 0,
      },
    ];
    jest.spyOn(dbCriteriaQacsItemModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsItemQuestionRepository.getOneByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await CriteriaQaCsItemQuestionRepository.getOneByFilter('')).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbCriteriaQacsItemModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await CriteriaQaCsItemQuestionRepository.create()).toEqual(bodyData);
  });
});

describe('updateWithFilter function', () => {
  test('Test update With Filter success', async () => {
    let mockReturnSuccessData = [
      {
        _id: 'data _id',
        formId: 'data formId',
        title: 'data title',
        weight: 'data weight',
        detail: 'data detail',
        listQuestions: [{ questionTitle: 'data questionTitle' }],
        __v: 0,
      },
    ];
    jest.spyOn(dbCriteriaQacsItemModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await CriteriaQaCsItemQuestionRepository.updateWithFilter({})).toEqual(mockReturnSuccessData);
  });
});

describe('removeItem function', () => {
  test('Test remove Item success', async () => {
    let mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbCriteriaQacsItemModel, 'deleteOne').mockImplementationOnce(() => {
      return mockReturnFindById;
    });
    expect(await CriteriaQaCsItemQuestionRepository.removeItem({ _id: '' })).toEqual(mockReturnFindById);
  });
});
