require('dotenv').config();
const path = require('path');
const moment = require('moment-timezone');
const dirname = require('app-root-path');
const { VarianceStatusEnum } = require(path.resolve(`${dirname}/src/constants/variances.constants`));
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { varianceRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbVariancesModel = dbModels.varianceModel;
const VarianceRepository = new varianceRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = [
        {
        __v: 0,
        _id: '63a4861a584ac72f2226f18b',
        agentEmployeeId: '',
        areaOfImprovement: '',
        areaOfStrength: '',
        completedDate: 1671726618,
        createdAt: 1671726618,
        differenceValue: null,
        groupId: '',
        internalNote: '',
        isDispute: false,
        netScore: null,
        note: '',
        qaAgentEmail: '',
        result: '',
        status: 'pending',
        updatedAt: null,
      }
    ];
    jest.spyOn(dbVariancesModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData)
    }));
    const expectResult = mockReturnSuccessData.map((item) => {
      if (item.completedDate) item.completedDate = moment(item.completedDate).unix();
      return item;
    });
    expect(await VarianceRepository.getListByFilter()).toEqual(expectResult);
  });
});

describe('findOneByFilter function', () => {
  test('Test find One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a4861a584ac72f2226f18b',
      agentEmployeeId: '',
      areaOfImprovement: '',
      areaOfStrength: '',
      completedDate: null,
      createdAt: 1671726618,
      differenceValue: null,
      groupId: '',
      internalNote: '',
      isDispute: false,
      netScore: null,
      note: '',
      qaAgentEmail: '',
      result: '',
      status: 'pending',
      updatedAt: null,
    };
    jest.spyOn(dbVariancesModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockReturnValue(mockReturnSuccessData),
    }));
    expect(await VarianceRepository.findOneByFilter()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbVariancesModel, 'findOne').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await VarianceRepository.findOneByFilter('')).toEqual(false);
  // });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbVariancesModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await VarianceRepository.create()).toEqual(bodyData);
  });
  // test('Test error catch case', async () => {
  //   jest.spyOn(dbVariancesModel.prototype, 'save').mockImplementationOnce(() => {
  //     return Promise.reject(false);
  //   });
  //   expect(await VarianceRepository.create({ _id: 'id' })).toEqual(false);
  // });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a4861a584ac72f2226f18b',
      agentEmployeeId: '',
      areaOfImprovement: '',
      areaOfStrength: '',
      completedDate: 1671726618,
      createdAt: 1671726618,
      differenceValue: null,
      groupId: '',
      internalNote: '',
      isDispute: false,
      netScore: null,
      note: '',
      qaAgentEmail: '',
      result: '',
      status: VarianceStatusEnum.COMPLETED,
      updatedAt: null,
    };
    let mockdataForUpdate = {
      __v: 0,
      _id: '63a4861a584ac72f2226f18b',
      agentEmployeeId: '',
      areaOfImprovement: '',
      areaOfStrength: '',
      completedDate: null,
      createdAt: 1671726618,
      differenceValue: null,
      groupId: '',
      internalNote: '',
      isDispute: false,
      netScore: null,
      note: '',
      qaAgentEmail: '',
      result: '',
      status: VarianceStatusEnum.COMPLETED,
      updatedAt: null,
    };
    jest.spyOn(dbVariancesModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockdataForUpdate);
    });
    expect(await VarianceRepository.update(mockReturnSuccessData, mockReturnSuccessData)).toEqual(mockdataForUpdate);
  });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbVariancesModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await VarianceRepository.deleteOne()).toEqual(true);
  });
  // test('Test delete One = 0 success', async () => {
  //   const mockReturnFindById = { deletedCount: 0 };
  //   jest.spyOn(dbVariancesModel, 'deleteOne').mockImplementationOnce(() => {
  //     return Promise.resolve(mockReturnFindById);
  //   });
  //   expect(await VarianceRepository.deleteOne()).toEqual(false);
  // });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbVariancesModel, 'deleteOne').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await VarianceRepository.deleteOne('')).toEqual(false);
  // });
});
