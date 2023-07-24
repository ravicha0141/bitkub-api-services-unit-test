require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');
/* const db = require(path.resolve(`${__dir}/src/databases/models/`));
const { dashboardServices } = require('../../src/classes/db-services');

let dbDashboards = db.dashboards;
const DashboardServices = new dashboardServices(); */

const { dashboardModel } = require(path.resolve(`${__dir}/src/databases/models/`));
const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const DashboardRepository = new repositoriesDb.dashboardRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getAll function', () => {
  test('Test get all data success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f917c5c133957a940cb72',
      archived: true,
      createdAt: 1669304700,
      date: '2022-11-24',
      key: '09:00:00-10:00:00',
      properties: {
        amount: 3,
        endedFormat: '10:00:00',
        endedUnix: 1669258800,
        groupId: '6341c612baf1d9eafd9dfbeb',
        startedFormat: '09:00:00',
        startedUnix: 1669255200,
      },
      tag: 'available-hc',
      updatedAt: null,
    };
    jest.spyOn(dashboardModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await DashboardRepository.getAll()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dashboardModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await DashboardRepository.getAll()).toEqual([]);
  });
});

describe('getOneByFilter function', () => {
  test('Test get one data by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f917c5c133957a940cb72',
      archived: true,
      createdAt: 1669304700,
      date: '2022-11-24',
      key: '09:00:00-10:00:00',
      properties: {
        amount: 3,
        endedFormat: '10:00:00',
        endedUnix: 1669258800,
        groupId: '6341c612baf1d9eafd9dfbeb',
        startedFormat: '09:00:00',
        startedUnix: 1669255200,
      },
      tag: 'available-hc',
      updatedAt: null,
    };
    jest.spyOn(dashboardModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await DashboardRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dashboardModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await DashboardRepository.getOneByFilter()).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dashboardModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await DashboardRepository.create()).toEqual(bodyData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dashboardModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve('test');
    });
    expect(await DashboardRepository.create({ _id: 'id' })).toEqual('test');
  });
});

describe('deleteOne function', () => {
  test('Test delete one data success', async () => {
    jest.spyOn(dashboardModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve('test');
    });
    expect(await DashboardRepository.deleteOne('id')).toEqual('test');
  });
  test('Test error catch case', async () => {
    jest.spyOn(dashboardModel, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(false);
    });
    expect(await DashboardRepository.deleteOne({ _id: 'id' })).toEqual(false);
  });
});

describe('findByIdAndUpdateById function', () => {
  test('Test find by id and update data success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f917c5c133957a940cb72',
      archived: true,
      createdAt: 1669304700,
      date: '2022-11-24',
      key: '09:00:00-10:00:00',
      properties: {
        amount: 3,
        endedFormat: '10:00:00',
        endedUnix: 1669258800,
        groupId: '6341c612baf1d9eafd9dfbeb',
        startedFormat: '09:00:00',
        startedUnix: 1669255200,
      },
      tag: 'available-hc',
      updatedAt: null,
    };
    jest.spyOn(dashboardModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await DashboardRepository.findByIdAndUpdateById()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dashboardModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject(false);
    });

    let result;
    let error;

    try {
      result = await DashboardRepository.findByIdAndUpdateById();
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual(false);
  });
});
