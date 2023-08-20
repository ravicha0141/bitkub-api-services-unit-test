require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');

const { onBreakTimeModel } = require(path.resolve(`${dirname}/src/databases/models/evaluates/on-break-times.model`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const OnBreakTimeRepository = new repositoriesDb.onBreakTimeRepository();

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
    jest.spyOn(onBreakTimeModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await OnBreakTimeRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(onBreakTimeModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockInvalidData),
    }));
    expect(await OnBreakTimeRepository.getListByFilter('')).toEqual(mockInvalidData);
  });
});

describe('getOneByFilter function', () => {
  test('Test get one by filter success', async () => {
    let mockReturnSuccessData = {
      status: true
    };
    jest.spyOn(onBreakTimeModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await OnBreakTimeRepository.getOneByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(onBreakTimeModel, 'findOne').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await OnBreakTimeRepository.getOneByFilter()).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let mockReturnSuccessData = {
      status: true
    };
    jest.spyOn(onBreakTimeModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await OnBreakTimeRepository.create()).toEqual(mockReturnSuccessData);
  });
});

describe('update function', () => {
  test('Test update data success', async () => {
    let mockReturnSuccessData = {
      status: true
    };
    jest.spyOn(onBreakTimeModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await OnBreakTimeRepository.update()).toEqual(mockReturnSuccessData);
  });
});

describe('deleteOne function', () => {
  test('Test delete one data success', async () => {
    const mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(onBreakTimeModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await OnBreakTimeRepository.deleteOne({ _id: '1234' })).toEqual(mockReturnFindById);
  });
});

