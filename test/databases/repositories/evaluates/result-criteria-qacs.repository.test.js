require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { resultEvaluateOfCriteriaQaCsRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));
const evaluateDto = require(path.resolve(`${dirname}/src/dto/evaluate.dto`));

let dbResultEvaluateOfQaCsModel = dbModels.resultEvaluateOfQaCsModel;
const ResultEvaluateOfCriteriaQaCsRepository = new resultEvaluateOfCriteriaQaCsRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get list by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638cdd68d0d97e5384c90ac1',
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      comment: '',
      completedDate: '2022-12-04T17:48:24.000Z',
      createdAt: 1671701884,
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      groupId: null,
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      updatedAt: 1670176104,
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Non-Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 1,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 1,
        },
      ],
    };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.getListByFilter('')).toEqual(false);
  });
});

describe('findOneByFilter function', () => {
  test('Test get one by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638cdd68d0d97e5384c90ac1',
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      comment: '',
      completedDate: '2022-12-04T17:48:24.000Z',
      createdAt: 1671701884,
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      groupId: null,
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      updatedAt: 1670176104,
      values: [
        {
          field: 'Faltal/NonFaltal',
          type: 'text',
          value: 'Non-Faltal',
        },
        {
          field: 'Result',
          type: 'number',
          value: 1,
        },
        {
          field: 'selectType',
          type: 'text',
          value: 'yes',
        },
        {
          field: 'Weigth',
          type: 'number',
          value: 1,
        },
      ],
    };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.findOneByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'findOne').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.findOneByFilter()).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let mockData = {
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      values: [],
      tags: [],
    };
    jest.spyOn(evaluateDto, 'createResultEvaluateDTO').mockImplementationOnce(() => {
      return Promise.resolve(mockData);
    });
    jest.spyOn(dbResultEvaluateOfQaCsModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockData);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.create()).toEqual(mockData);
  });
});

describe('update function', () => {
  test('Test update data success', async () => {
    let mockData = {
      assignmentId: '638cc3529ef1ffb0fa2c4376',
      evaluateId: '638cc3599ef1ffb0fa2c43b6',
      referDetail: '1',
      referFrom: 'item',
      referId: '6385babe36ec587b4dfe2819',
      referOrder: '1.1',
      referTitle: '1',
      values: [],
      tags: [],
    };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockData),
    }));
    expect(await ResultEvaluateOfCriteriaQaCsRepository.update()).toEqual(mockData);
  });
});

describe('deleteOne function', () => {
  test('Test delete one data success', async () => {
    const mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.deleteOne('594ced02ed345b2b049222c5')).toEqual(mockReturnFindById);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.deleteOne('')).toEqual(null);
  });
});

describe('deleteMany function', () => {
  test('Test delete many data success', async () => {
    let mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    // await ResultsService.create(mockData);
    expect(await ResultEvaluateOfCriteriaQaCsRepository.deleteMany()).toEqual(true);
  });
  test('Test delete assignment < 0', async () => {
    let mockReturnFindById = { deletedCount: 0 };
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.deleteMany({ _id: null })).toEqual(false);
  });
  test('Test error catch case', async () => {
    let mockReturnFindById = undefined;
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await ResultEvaluateOfCriteriaQaCsRepository.deleteMany('')).toEqual(false);
  });
});
