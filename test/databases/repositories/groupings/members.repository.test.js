require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');

const { memberModel: dbMembers, groupModel: dbGroups } = require(path.resolve(`${__dir}/src/databases/models/`));
const repositoriesDb = require(path.resolve(`${__dir}/src/databases/repositories`));
const MemberRepository = new repositoriesDb.memberRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getMemberAndGroupInfo function', () => {
  test('should return members with groupInfo', async () => {
    const mockMemberData = [
      { _id: 'member1', groupId: 'group1' },
      { _id: 'member2', groupId: 'group2' },
    ];
    jest.spyOn(dbMembers, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockMemberData),
    }));
    const mockGroupData = [
      { _id: 'member1', groupId: 'group1' },
      { _id: 'member2', groupId: 'group2' },
    ];
    jest.spyOn(dbGroups, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockGroupData),
    }));
    const mockGroupMap = new Map(mockGroupData.map((group) => [group._id, group]));
    const result = await MemberRepository.getMemberAndGroupInfo({});
    const expectedResult = mockMemberData.map((m) => {
      m.groupInfo = mockGroupMap.get(m.groupId);
      return m;
    });
    expect(result).toEqual(expectedResult);
  });
  test('should be handle error', async () => {
    jest.spyOn(dbMembers, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockRejectedValue(false),
    }));
    try {
      await MemberRepository.getMemberAndGroupInfo({});
    } catch (error) {
      expect(error).toEqual(false);
    }
  });
});

describe('getListWithFilter function', () => {
  test('Test get List With Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '631662a4f55f573399f8dc22',
      createdAt: 1671720365,
      email: 'bitkubagent1@bitkub.com',
      groupId: '630ceb60fdd0d440c056e3c0',
      name: 'bitkubagent3',
      role: 'qaAgent',
      updatedAt: null,
      userId: '624fe297790139ea1d6885c7',
    };
    jest.spyOn(dbMembers, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await MemberRepository.getListWithFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('getOneWithFilter function', () => {
  test('Test get One With Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '631662a4f55f573399f8dc22',
      createdAt: 1671720365,
      email: 'bitkubagent1@bitkub.com',
      groupId: '630ceb60fdd0d440c056e3c0',
      name: 'bitkubagent3',
      role: 'qaAgent',
      updatedAt: null,
      userId: '624fe297790139ea1d6885c7',
    };
    jest.spyOn(dbMembers, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await MemberRepository.getOneWithFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('checkMemberExist function', () => {
  test('should be return success', async () => {
    jest.spyOn(dbMembers, 'exists').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await MemberRepository.checkMemberExist({})).toEqual(true);
  });
  test('should be return null', async () => {
    expect(await MemberRepository.checkMemberExist({ _id: null })).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbMembers.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await MemberRepository.create()).toEqual(bodyData);
  });
});

describe('deleteOne function', () => {
  test('Test delete One success', async () => {
    jest.spyOn(dbMembers, 'findOneAndDelete').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await MemberRepository.deleteOne({})).toEqual(true);
  });
  test('should be return null', async () => {
    expect(await MemberRepository.deleteOne({ _id: null })).toEqual(null);
  });
});

describe('countMemberWithFilter function', () => {
  test('should be return success', async () => {
    jest.spyOn(dbMembers, 'countDocuments').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await MemberRepository.countMemberWithFilter({})).toEqual(true);
  });
});
