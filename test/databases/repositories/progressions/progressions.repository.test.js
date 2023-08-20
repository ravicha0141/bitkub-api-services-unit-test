require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { progressionRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbModelProgression = dbModels.progressionModel;
const ProgressionRepository = new progressionRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getAll function', () => {
  test('Test get All success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a33f09a934f7bb58bf69eb',
      amount: 73238,
      createdAt: 1671637864,
      date: '2022-12-22',
      endTime: 1671716127,
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      startTime: 1671642889,
      status: false,
      type: 'on-duty',
      updatedAt: null,
    };
    jest.spyOn(dbModelProgression, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await ProgressionRepository.getAll()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbModelProgression, 'find').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await ProgressionRepository.getAll('')).toEqual(false);
  // });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a33f09a934f7bb58bf69eb',
      amount: 73238,
      createdAt: 1671637864,
      date: '2022-12-22',
      endTime: 1671716127,
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      startTime: 1671642889,
      status: false,
      type: 'on-duty',
      updatedAt: null,
    };
    jest.spyOn(dbModelProgression, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await ProgressionRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a33f09a934f7bb58bf69eb',
      amount: 73238,
      createdAt: 1671637864,
      date: '2022-12-22',
      endTime: 1671716127,
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      startTime: 1671642889,
      status: false,
      type: 'on-duty',
      updatedAt: null,
    };
    jest.spyOn(dbModelProgression, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await ProgressionRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbModelProgression, 'findOne').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await ProgressionRepository.getOneByFilter('')).toEqual(false);
  // });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbModelProgression.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await ProgressionRepository.create()).toEqual(bodyData);
  });
  // test('Test error catch case', async () => {
  //   jest.spyOn(dbModelProgression.prototype, 'save').mockImplementationOnce(() => {
  //     return Promise.reject(false);
  //   });
  //   expect(await ProgressionRepository.create({ _id: 'id' })).toEqual(false);
  // });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a33f09a934f7bb58bf69eb',
      amount: 73238,
      createdAt: 1671637864,
      date: '2022-12-22',
      endTime: 1671716127,
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      startTime: 1671642889,
      status: false,
      type: 'on-duty',
      updatedAt: null,
    };
    jest.spyOn(dbModelProgression, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ProgressionRepository.update()).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbModelProgression, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await ProgressionRepository.update('')).toEqual(false);
  // });
});

describe('updateManyWithFilter function', () => {
  test('Test update Many With Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a33f09a934f7bb58bf69eb',
      amount: 73238,
      createdAt: 1671637864,
      date: '2022-12-22',
      endTime: 1671716127,
      groupId: '63a32c76a934f7bb58bf566d',
      groupName: 'Test authority 1',
      qaAgentEmail: 'qaagent01@bitkub.com',
      qaAgentId: '63a32ee4a934f7bb58bf61eb',
      startTime: 1671642889,
      status: false,
      type: 'on-duty',
      updatedAt: null,
    };
    jest.spyOn(dbModelProgression, 'updateMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await ProgressionRepository.updateManyWithFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbModelProgression, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await ProgressionRepository.deleteOne()).toEqual(true);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbModelProgression, 'findOneAndDelete').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await ProgressionRepository.deleteOne('')).toEqual(false);
  // });
});

describe('deleteMany function', () => {
  test('Test delete Many success', async () => {
    jest.spyOn(dbModelProgression, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await ProgressionRepository.deleteMany()).toEqual(undefined);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbModelProgression, 'deleteMany').mockImplementationOnce(() => {
  //     return Promise.reject(mockInvalidData);
  //   });
  //   expect(await ProgressionRepository.deleteMany('')).toEqual(false);
  // });
});
