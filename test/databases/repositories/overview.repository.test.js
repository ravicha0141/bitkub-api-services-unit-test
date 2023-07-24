require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { overviewRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbOverviewModel = dbModels.overviewModel;
const OverviewRepository = new overviewRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOverviewData function', () => {
  test('Test get overview data success', async () => {
    let mockReturnSuccessData = {
      _id: 'data _id',
      availableStatus: 'data availableStatus',
      consultStatus: 'data consultStatus',
      healthIssuesStatus: 'data healthIssuesStatus',
      meetingStatus: 'data meetingStatus',
      onBreaksStatus: 'data onBreaksStatus',
      redOnStatus: 'data redOnStatus',
      redStatus: 'data redStatus',
      technicalIssueStatus: 'data technicalIssueStatus',
      title: 'data title',
    };
    jest.spyOn(dbOverviewModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await OverviewRepository.getOverviewData()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbOverviewModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await OverviewRepository.getOverviewData()).toEqual(false);
  });
});

describe('update function', () => {
  test('Test update success', async () => {
    let mockReturnFindById = { title: 'Overview' };
    let mockReturnFindByIdAndUpdate = [
      {
        _id: 'data _id',
        availableStatus: 'data availableStatus',
        consultStatus: 'data consultStatus',
        healthIssuesStatus: 'data healthIssuesStatus',
        meetingStatus: 'data meetingStatus',
        onBreaksStatus: 'data onBreaksStatus',
        redOnStatus: 'data redOnStatus',
        redStatus: 'data redStatus',
        technicalIssueStatus: 'data technicalIssueStatus',
        title: 'data title',
      },
    ];
    jest.spyOn(dbOverviewModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindByIdAndUpdate);
    });
    expect(await OverviewRepository.update(mockReturnFindById, mockReturnFindByIdAndUpdate)).toEqual(mockReturnFindByIdAndUpdate);
  });
  // test('Test error catch case', async () => {
  //   const mockInvalidData = undefined;
  //   jest.spyOn(dbOverviewModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
  //     return Promise.resolve(mockInvalidData);
  //   });
  //   expect(await OverviewRepository.update('')).toEqual(false);
  // });
});
