require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const reportOfCompliantAndNoncompliantRepository = require(path.resolve(`${dirname}/src/databases/repositories/reports/report-compliant-and-noncompliant.repository`));
const ReportOfCompliantAndNoncompliantRepository = new reportOfCompliantAndNoncompliantRepository();
const SCORE_THRESHOLD = 85;
const { 
  groupModel,
  resultEvaluateOfQaCsModel,
  evaluateModel,
  resultEvaluateOfKycModel,
  criteriaKycFormModel
} = require(path.resolve(`${dirname}/src/databases/models`));

afterEach(() => {
  jest.restoreAllMocks();
});
describe('getReportCriteriaKycByWeek', () => {
  test('returns data successfully', async () => {
    jest.spyOn(evaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue([{ _id: 'eval1', groupId: 'group1' }]),
    }));
    const mockCountEvaluateByWeekQuery = Promise.resolve([
      {
        _id: { dateUnit: 1, groupId: 'group1' },
        totalEval: 10,
        totalPassed: 8,
      },
    ]);
    jest.spyOn(evaluateModel, 'aggregate').mockReturnValue(mockCountEvaluateByWeekQuery);
    const mockQuestionQuery = Promise.resolve([
      {
        questionId: 'question1',
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        questionId: 'question2',
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(criteriaKycFormModel, 'aggregate').mockReturnValue(mockQuestionQuery);
    const mockGroupNamesQuery = [
      {
        _id: 'group1',
        name: 'Group 1',
      },
    ];
    jest.spyOn(groupModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockGroupNamesQuery),
    }));
    const mockResultQuery = Promise.resolve([
      {
        _id: { dateUnit: 1, questionId: 'question1' },
        countResultNo: 2,
        countEvaluation: 10,
      },
      {
        _id: { dateUnit: 1, questionId: 'question2' },
        countResultNo: 1,
        countEvaluation: 10,
      },
    ]);
    jest.spyOn(resultEvaluateOfKycModel, 'aggregate').mockReturnValue(mockResultQuery);
    const expectedResult = {
      reportHeaders: ['Title', 'W2'],
      reportData: [
        { Title: '1). Question 1', W2: '20%' },
        { Title: '2). Question 2', W2: '10%' },
        { Title: '', W2: '' },
        { Title: 'Title', W2: 'W2' },
        { Title: 'Passed', W2: '80%' },
        { Title: 'Not Passed', W2: '20%' },
        { Title: '', W2: '' },
        { Title: 'Team', W2: 'Tickets Monitored(W2)' },
        { Title: 'Group 1', W2: '10' }
      ],
    };
    const result = await ReportOfCompliantAndNoncompliantRepository.getReportCriteriaKycByWeek({});
    expect(result).toEqual(expectedResult);
  });
});

describe('getReportCriteriaQaCsByWeek', () => {
  test('returns data successfully', async () => {
    // Mocking the required data
    const mockEvaluateQuery = Promise.resolve([{ _id: 'eval1', groupId: 'group1' }]);
    jest.spyOn(evaluateModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockEvaluateQuery) });

    const mockCountEvaluateQuery = Promise.resolve([
      {
        _id: { dateUnit: 1, groupId: 'group1' },
        totalEval: 10,
        totalPassed: 8,
      },
    ]);
    jest.spyOn(evaluateModel, 'aggregate').mockReturnValue(mockCountEvaluateQuery);

    const mockQuestionQuery = Promise.resolve([
      {
        questionId: 'question1',
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        questionId: 'question2',
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(resultEvaluateOfQaCsModel, 'aggregate').mockReturnValue(mockQuestionQuery);

    const mockGroupNamesQuery = Promise.resolve([
      {
        _id: 'group1',
        name: 'Group 1',
      },
    ]);
    jest.spyOn(groupModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockGroupNamesQuery) });

    const mockResultQuery = Promise.resolve([
      {
        _id: { dateUnit: 1, questionId: 'question1' },
        countResultNo: 2,
        countEvaluation: 10,
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        _id: { dateUnit: 1, questionId: 'question2' },
        countResultNo: 1,
        countEvaluation: 10,
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(resultEvaluateOfQaCsModel, 'aggregate').mockReturnValue(mockResultQuery);

    // Expected result
    const expectedResult = {
      reportHeaders: ['Title', 'W2'],
      reportData: [
        { Title: '1). Question 1', W2: '20%' },
        { Title: '2). Question 2', W2: '10%' },
        { Title: '', W2: '' },
        { Title: 'Title', W2: 'W2' },
        { Title: 'Passed', W2: '80%' },
        { Title: 'Not Passed', W2: '20%' },
        { Title: '', W2: '' },
        { Title: 'Team', W2: 'Tickets Monitored(W2)' },
        { Title: 'Group 1', W2: '10' },
      ],
    };

    const result = await ReportOfCompliantAndNoncompliantRepository.getReportCriteriaQaCsByWeek({});
    expect(result).toEqual(expectedResult);
  });
});

describe('getReportCriteriaKycByDate', () => {
  test('returns data successfully', async () => {
    // Mocking the required data
    const mockEvaluateQuery = Promise.resolve([{ _id: 'eval1', groupId: 'group1' }]);
    jest.spyOn(evaluateModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockEvaluateQuery) });

    const mockCountEvaluateQuery = Promise.resolve([
      {
        _id: { year: 2023, month: 7, day: 1, groupId: 'group1' },
        totalEval: 10,
        totalPassed: 8,
      },
    ]);
    jest.spyOn(evaluateModel, 'aggregate').mockReturnValue(mockCountEvaluateQuery);

    const mockQuestionQuery = Promise.resolve([
      {
        questionId: 'question1',
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        questionId: 'question2',
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(criteriaKycFormModel, 'aggregate').mockReturnValue(mockQuestionQuery); // Mock criteriaKycFormModel

    const mockGroupNamesQuery = Promise.resolve([
      {
        _id: 'group1',
        name: 'Group 1',
      },
    ]);
    jest.spyOn(groupModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockGroupNamesQuery) });

    const mockResultQuery = Promise.resolve([
      {
        _id: { year: 2023, month: 7, day: 1, questionId: 'question1' },
        countResultNo: 2,
        countEvaluation: 10,
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        _id: { year: 2023, month: 7, day: 1, questionId: 'question2' },
        countResultNo: 1,
        countEvaluation: 10,
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(resultEvaluateOfKycModel, 'aggregate').mockReturnValue(mockResultQuery);

    // Expected result
    const expectedResult = {
      reportHeaders: ['Title', '1/7/2023'],
      reportData: [
        { Title: '1). Question 1', '1/7/2023': '20%' },
        { Title: '2). Question 2', '1/7/2023': '10%' },
        { Title: '', '1/7/2023': '' },
        { Title: 'Title', '1/7/2023': '1/7/2023' },
        { Title: 'Passed', '1/7/2023': '80%' },
        { Title: 'Not Passed', '1/7/2023': '20%' },
        { Title: '', '1/7/2023': '' },
        { Title: 'Team', '1/7/2023': 'Tickets Monitored(1/7/2023)' },
        { Team: 'Group 1', '1/7/2023': '10' },
      ],
    };

    const result = await ReportOfCompliantAndNoncompliantRepository.getReportCriteriaKycByDate({});
    expect(result).toEqual(expectedResult);
  });
});

describe('getReportCriteriaQaCsByDate', () => {
  test('returns data successfully', async () => {
    // Mocking the required data
    const mockEvaluateQuery = Promise.resolve([{ _id: 'eval1', groupId: 'group1' }]);
    jest.spyOn(evaluateModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockEvaluateQuery) });

    const mockCountEvaluateQuery = Promise.resolve([
      {
        _id: { year: 2023, month: 7, day: 1, groupId: 'group1' },
        totalEval: 10,
        totalPassed: 8,
      },
    ]);
    jest.spyOn(evaluateModel, 'aggregate').mockReturnValue(mockCountEvaluateQuery);

    const mockQuestionQuery = Promise.resolve([
      {
        questionId: 'question1',
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        questionId: 'question2',
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(criteriaKycFormModel, 'aggregate').mockReturnValue(mockQuestionQuery);

    const mockGroupNamesQuery = Promise.resolve([
      {
        _id: 'group1',
        name: 'Group 1',
      },
    ]);
    jest.spyOn(groupModel, 'find').mockReturnValue({ lean: jest.fn().mockResolvedValue(mockGroupNamesQuery) });

    const mockResultQuery = Promise.resolve([
      {
        _id: { year: 2023, month: 7, day: 1, questionId: 'question1' },
        countResultNo: 2,
        countEvaluation: 10,
        questionTitle: '1). Question 1',
        questionDetail: '',
      },
      {
        _id: { year: 2023, month: 7, day: 1, questionId: 'question2' },
        countResultNo: 1,
        countEvaluation: 10,
        questionTitle: '2). Question 2',
        questionDetail: '',
      },
    ]);
    jest.spyOn(resultEvaluateOfQaCsModel, 'aggregate').mockReturnValue(mockResultQuery);

    // Expected result
    const expectedResult = {
      reportHeaders: ['Title', '1/7/2023'],
      reportData: [
        { Title: '1). Question 1', '1/7/2023': '20%' },
        { Title: '2). Question 2', '1/7/2023': '10%' },
        { Title: '', '1/7/2023': '' },
        { Title: 'Title', '1/7/2023': '1/7/2023' },
        { Title: 'Passed', '1/7/2023': '80%' },
        { Title: 'Not Passed', '1/7/2023': '20%' },
        { Title: '', '1/7/2023': '' },
        { Title: 'Team', '1/7/2023': 'Tickets Monitored(1/7/2023)' },
        { Title: 'Group 1', '1/7/2023': '10' },
      ],
    };

    const result = await ReportOfCompliantAndNoncompliantRepository.getReportCriteriaQaCsByDate({});
    expect(result).toEqual(expectedResult);
  });
});