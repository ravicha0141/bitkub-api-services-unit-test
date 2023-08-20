require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');

/* const db = require(path.resolve(`${__dir}/src/databases/models/`));
const { GradesRepository } = require('../../src/classes/db-services/index');
let dbGrades = db.grades;
const GradesRepository = new GradesRepository(); */

const { gradeModel: dbGrades } = require(path.resolve(`${__dir}/src/databases/models/`));
const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const GradesRepository = new repositoriesDb.gradesRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('isExist function', () => {
  test('Test is Exist success', async () => {
    jest.spyOn(dbGrades, 'exists').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await GradesRepository.isExist({})).toEqual(true);
  });
  test('should be return null', async () => {
    expect(await GradesRepository.isExist({ _id: 'test' })).toEqual(null);
  });
});

describe('getListWithFilter function', () => {
  test('Test get List With Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637d145043f0ce7bd894a4b9',
      createdAt: 1669141575,
      grades: [
        {
          label: 'E',
          max: 59,
          min: 50,
        },
      ],
      groupId: '6356cfef2958325ea3a4a08f',
      updatedAt: 1669142876,
    };
    jest.spyOn(dbGrades, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GradesRepository.getListWithFilter({})).toEqual(mockReturnSuccessData);
  });
  test('should be return null', async () => {
    expect(await GradesRepository.getListWithFilter({ _id: null })).toEqual(null);
  });
});

describe('getOneWithFilter function', () => {
  test('Test get One With Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637d145043f0ce7bd894a4b9',
      createdAt: 1669141575,
      grades: [
        {
          label: 'F',
          max: 49,
          min: 0,
        },
      ],
      groupId: '6356cfef2958325ea3a4a08f',
      updatedAt: 1669142876,
    };
    jest.spyOn(dbGrades, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GradesRepository.getOneWithFilter({})).toEqual(mockReturnSuccessData);
  });
  test('should be return null', async () => {
    expect(await GradesRepository.getOneWithFilter({ _id: null })).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbGrades, 'create').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await GradesRepository.create()).toEqual(bodyData);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637d145043f0ce7bd894a4b9',
      createdAt: 1669141575,
      grades: [
        {
          label: 'A',
          max: 100,
          min: 90,
        },
      ],
      groupId: '6356cfef2958325ea3a4a08f',
      updatedAt: 1669142876,
    };
    jest.spyOn(dbGrades, 'findById').mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GradesRepository.update('637d145043f0ce7bd894a4b9', mockReturnSuccessData)).toEqual(mockReturnSuccessData);
  });
  test('should be return null', async () => {
    expect(await GradesRepository.update({ _id: 'test' })).toEqual(null);
  });
});

describe('delete function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637d145043f0ce7bd894a4b9',
      createdAt: 1669141575,
      grades: [
        {
          label: 'A',
          max: 100,
          min: 90,
        },
      ],
      groupId: '6356cfef2958325ea3a4a08f',
      updatedAt: 1669142876,
    };
    jest.spyOn(dbGrades, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await GradesRepository.deleteOne({})).toEqual(mockReturnSuccessData);
  });
  test('should be return null', async () => {
    expect(await GradesRepository.deleteOne({ _id: 'test' })).toEqual(null);
  });
});
