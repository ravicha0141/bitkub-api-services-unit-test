require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { criteriaQaCsIssueRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbModelsQACSIssue = dbModels.qacsIssueModel;
const CriteriaQaCsIssueRepository = new criteriaQaCsIssueRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f99505c133957a940d67c',
      actived: true,
      createdAt: 1669306704,
      isDefaultForm: false,
      name: 'QA CS evaluation form test ',
      targetScore: 100,
      trackType: 'criteria-qa-cs',
      updatedAt: null,
    };
    jest.spyOn(dbModelsQACSIssue, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsIssueRepository.getListByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbModelsQACSIssue, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await CriteriaQaCsIssueRepository.getListByFilter()).toEqual(null);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f99505c133957a940d67c',
      actived: true,
      createdAt: 1669306704,
      isDefaultForm: false,
      name: 'QA CS evaluation form test ',
      targetScore: 100,
      trackType: 'criteria-qa-cs',
      updatedAt: null,
    };
    jest.spyOn(dbModelsQACSIssue, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsIssueRepository.getOneByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbModelsQACSIssue, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await CriteriaQaCsIssueRepository.getOneByFilter()).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbModelsQACSIssue.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await CriteriaQaCsIssueRepository.create()).toEqual(bodyData);
  });
});

describe('updateWithFilter function', () => {
  test('Test update with filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '637f99505c133957a940d67c',
      actived: true,
      createdAt: 1669306704,
      isDefaultForm: false,
      name: 'QA CS evaluation form test ',
      targetScore: 100,
      trackType: 'criteria-qa-cs',
      updatedAt: null,
    };
    jest.spyOn(dbModelsQACSIssue, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsIssueRepository.updateWithFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbModelsQACSIssue, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await CriteriaQaCsIssueRepository.updateWithFilter()).toEqual(null);
  });
});

describe('removeItem function', () => {
  test('Test remove Item success', async () => {
    jest.spyOn(dbModelsQACSIssue, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await CriteriaQaCsIssueRepository.removeItem('id')).toEqual(true);
  });
});
