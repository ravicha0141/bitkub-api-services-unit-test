require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { groupRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbGroupModel = dbModels.groupModel;
const GroupRepository = new groupRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getGroupsWithFilter function', () => {
  test('Test get groups with filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GroupRepository.getGroupsWithFilter({})).toEqual(mockReturnSuccessData);
  });
});

describe('getGroupById function', () => {
  test('Test get group by id success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GroupRepository.getGroupById('63a32c76a934f7bb58bf566d')).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await GroupRepository.getGroupById({ _id: '1234' })).toEqual(null);
  });
});

describe('getOneByFilter function', () => {
  test('Test get oen by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GroupRepository.getOneByFilter({})).toEqual(mockReturnSuccessData);
  });
});

describe('checkGroupExist function', () => {
  test('Test check Group Exist success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'exists').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await GroupRepository.checkGroupExist(mockReturnSuccessData)).toEqual(true);
  });
  test('Test error catch case', async () => {
    expect(await GroupRepository.checkGroupExist({ _id: '1234' })).toEqual(null);
  });
});

describe('getOneGroupWithFilter function', () => {
  test('Test get one group with filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await GroupRepository.getOneGroupWithFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    let mockReturnErrCatchCase = {
        message: 'Unexpected token u in JSON at position 0'
    };
    jest.spyOn(dbGroupModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockRejectedValue(mockReturnErrCatchCase),
    }));
    const result = await GroupRepository.getOneGroupWithFilter('');
    expect(result.error.message).toEqual(mockReturnErrCatchCase.message);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbGroupModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await GroupRepository.create()).toEqual(bodyData);
  });
});

describe('updateGroupByObj function', () => {
  test('Test update group by object success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(dbGroupModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await GroupRepository.updateGroupByObj()).toEqual(mockReturnSuccessData);
  });
});

describe('deleteGroup function', () => {
  test('Test delete group data success', async () => {
    jest.spyOn(dbGroupModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await GroupRepository.deleteGroup('63a32c76a934f7bb58bf566d')).toEqual(undefined);
  });
  test('Test error catch case', async () => {
    expect(await GroupRepository.deleteGroup('1234')).toEqual(null);
  });
});
