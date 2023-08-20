require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { criteriaQaCsRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbCriteriaQaCsFormModel = dbModels.criteriaQaCsFormModel;
const CriteriaQaCsRepository = new criteriaQaCsRepository();

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
    jest.spyOn(dbCriteriaQaCsFormModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await CriteriaQaCsRepository.getListByFilter({})).toEqual(mockReturnSuccessData);
  });
});

describe('getOneFormWithFilter function', () => {
  test('Test get One Form With Filter success', async () => {
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
    jest.spyOn(dbCriteriaQaCsFormModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await CriteriaQaCsRepository.getOneFormWithFilter({})).toEqual(mockReturnSuccessData);
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
    jest.spyOn(dbCriteriaQaCsFormModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await CriteriaQaCsRepository.getOneByFilter({})).toEqual(mockReturnSuccessData);
  });
});

describe('createForm function', () => {
  test('Test create Form success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbCriteriaQaCsFormModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await CriteriaQaCsRepository.createForm()).toEqual(bodyData);
  });
});

describe('updateFormByIdWithObject function', () => {
  test('Test update Form By Id With Object success', async () => {
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
    jest.spyOn(dbCriteriaQaCsFormModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsRepository.updateFormByIdWithObject({})).toEqual(mockReturnSuccessData);
  });
});

describe('deleteForm function', () => {
  test('Test delete Form success', async () => {
    jest.spyOn(dbCriteriaQaCsFormModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await CriteriaQaCsRepository.deleteForm({ _id: '' })).toEqual(true);
  });
});
