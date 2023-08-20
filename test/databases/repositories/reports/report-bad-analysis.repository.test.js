require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const badAnalysisFormModel = require(path.resolve(`${dirname}/src/databases/models/forms/bad-analysis-form/bad-analysis-form.model`));
const resultOfBadAnalysisModel = require(path.resolve(`${dirname}/src/databases/models/evaluates/result-of-bad-analysis.model`));
const reportOfBadAnalysisRepository = require(path.resolve(`${dirname}/src/databases/repositories/reports/report-bad-analysis.repository`));
const { gradeDefault } = require(path.resolve(`${dirname}/src/constants/grade.constants`));
const FREQUENCY_TYPE = { WEEK: 'ALL_WK', MONTH: 'ALL_MM', YEAR: 'ALL_YEAR' };

let dbUserModel = dbModels.userModel;
let dbResultEvaluateOfQaCsModel = dbModels.resultEvaluateOfQaCsModel;
let dbEvaluateModel = dbModels.evaluateModel;
let dbResultEvaluateOfKycModel = dbModels.resultEvaluateOfKycModel;
const ReportOfBadAnalysisRepository = new reportOfBadAnalysisRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getReportTotalBad', () => {
  test('return data success with ALL_WK', async () => {
    const mockChoiceList = [
        {
          choiceId: 'choice1',
          choiceName: 'Choice 1',
        },
        {
          choiceId: 'choice2',
          choiceName: 'Choice 2',
        },
      ];
    jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
    const mockResultBadAnalysisData = [
        {
          _id: 2023,
          choices: [
            { id: 'choice1', count: 10 },
            { id: 'choice2', count: 15 },
          ],
          countTotal: 25,
        },
      ];
    jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
    const expectData = {
        reportHeaders: ['Choice 1 (count)', 'Choice 1 (percent)', 'Choice 2 (count)', 'Choice 2 (percent)'],
        reportData: [
          {
            title: 'W2024',
            total: '25',
            'Choice 1 (count)': '10',
            'Choice 1 (percent)': '40%',
            'Choice 2 (count)': '15',
            'Choice 2 (percent)': '60%',
          },
        ],
      };
    const result = await ReportOfBadAnalysisRepository.getReportTotalBad('ALL_WK', {});
    expect(result).toEqual(expectData);
  });

  test('return data success with ALL_MM', async () => {
    const mockChoiceList = [
        {
          choiceId: 'choice1',
          choiceName: 'Choice 1',
        },
        {
          choiceId: 'choice2',
          choiceName: 'Choice 2',
        },
      ];
    jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
    const mockResultBadAnalysisData = [
        {
          _id: 2023,
          choices: [
            { id: 'choice1', count: 10 },
            { id: 'choice2', count: 15 },
          ],
          countTotal: 25,
        },
      ];
    jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
    const expectData = {
        reportHeaders: ['Choice 1 (count)', 'Choice 1 (percent)', 'Choice 2 (count)', 'Choice 2 (percent)'],
        reportData: [
          {
            title: 'M2023',
            total: '25',
            'Choice 1 (count)': '10',
            'Choice 1 (percent)': '40%',
            'Choice 2 (count)': '15',
            'Choice 2 (percent)': '60%',
          },
        ],
      };
    const result = await ReportOfBadAnalysisRepository.getReportTotalBad('ALL_MM', {});
    expect(result).toEqual(expectData);
  });
});
describe('getReportTotalBad', () => {
    test('return data success with ALL_WK', async () => {
      const mockChoiceList = [
        {
          choiceId: 'choice1',
          choiceName: 'Choice 1',
        },
        {
          choiceId: 'choice2',
          choiceName: 'Choice 2',
        },
      ];
      jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);

      const mockConcat = jest.fn((suffix) => `${suffix}`);
      mockChoiceList.forEach((choice) => {
        choice.choiceName = {
          concat: mockConcat,
        };
      });
  
      const mockResultBadAnalysisData = [
        {
          _id: 2023,
          choices: [
            { id: 'choice1', count: 10 },
            { id: 'choice2', count: 15 },
          ],
          countTotal: 25,
        },
      ];
      jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
  
      const expectData = {
        reportHeaders: [' (count)', ' (percent)', ' (count)', ' (percent)'],
        reportData: [
          {
            title: 'W2024',
            total: '25',
            " (count)": "15",
            " (percent)": "60%"
          },
        ],
      };
      const result = await ReportOfBadAnalysisRepository.getReportTotalBad('ALL_WK', {});
      expect(result).toEqual(expectData);
    });
});

describe('getReportTeamBad', () => {
    test('return data success', async () => {
      const mockChoiceList = [
        {
          choiceId: 'choice1',
          choiceName: 'Choice 1',
        },
        {
          choiceId: 'choice2',
          choiceName: 'Choice 2',
        },
      ];
      jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
  
      const mockConcat = jest.fn((suffix) => `${suffix}`);
      mockChoiceList.forEach((choice) => {
        choice.choiceName = {
          concat: mockConcat,
        };
      });
  
      const mockResultBadAnalysisData = [
        {
          _id: 'groupId1',
          groupName: 'Group 1',
          choices: [
            { id: 'choice1', count: 10 },
            { id: 'choice2', count: 15 },
          ],
          countTotal: 25,
        },
        {
          _id: 'groupId2',
          groupName: 'Group 2',
          choices: [
            { id: 'choice1', count: 8 },
            { id: 'choice2', count: 12 },
          ],
          countTotal: 20,
        },
      ];
      jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
  
      const expectData = {
        reportHeaders: [
            " (count)",
            " (percent)",
            " (count)",
            " (percent)"
        ],
        reportData: [
          {
            groupId: 'groupId1',
            groupName: 'Group 1',
            total: '25',
            ' (count)': '15',
            ' (percent)': '60%'
          },
          {
            groupId: 'groupId2',
            groupName: 'Group 2',
            total: '20',
            ' (count)': '12',
            ' (percent)': '60%'
          },
          {
            groupId: '0000',
            groupName: 'Total',
            total: '45'
          },
        ],
      };
  
      const result = await ReportOfBadAnalysisRepository.getReportTeamBad({});
      expect(result).toEqual(expectData);
    });
});

describe('getReportAgentBad', () => {
    const mockChoiceList = [
        {
        choiceId: 'choice1',
        choiceName: 'Choice 1',
        },
        {
        choiceId: 'choice2',
        choiceName: 'Choice 2',
        },
    ];
  
    const mockResultBadAnalysisData = [
        {
        _id: 2023,
        choices: [
            { id: 'choice1', count: 10 },
            { id: 'choice2', count: 15 },
        ],
        countTotal: 25,
        },
    ];
    
    test('returns data success with ALL_WK', async () => {
      jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
      jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
  
      const result = await ReportOfBadAnalysisRepository.getReportAgentBad('ALL_WK', {});
      const expectDataAllWk = {
        reportHeaders: ['Choice 1', 'Choice 2'],
        reportData: [
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: 'W2024',
            total: '25',
          },
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: 'TOTAL',
            total: '25',
          },
          {
            "Choice 1": "40%",
            "Choice 2": "60%",
            "title": "",
            "total": "100%",
          },
        ],
      };
      expect(result).toEqual(expectDataAllWk);
    });
  
    test('returns data success with ALL_MM', async () => {
      jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
      jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
  
      const result = await ReportOfBadAnalysisRepository.getReportAgentBad('ALL_MM', {});
      const expectDataAllMm = {
        reportHeaders: ['Choice 1', 'Choice 2'],
        reportData: [
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: undefined,
            total: '25'
          },
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: 'TOTAL',
            total: '25'
          },
          {
            'Choice 1': '40%',
            'Choice 2': '60%',
            title: '',
            total: '100%'
          }
        ],
      };
      expect(result).toEqual(expectDataAllMm);
    });

    test('returns data success with other frequency', async () => {
      jest.spyOn(badAnalysisFormModel, 'aggregate').mockResolvedValue(mockChoiceList);
      jest.spyOn(resultOfBadAnalysisModel, 'aggregate').mockResolvedValue(mockResultBadAnalysisData);
  
      const result = await ReportOfBadAnalysisRepository.getReportAgentBad('OTHER_FREQUENCY', {});
      const expectDataOtherCases = {
        reportHeaders: ['Choice 1', 'Choice 2'],
        reportData: [
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: '2023',
            total: '25'
          },
          {
            'Choice 1': '10',
            'Choice 2': '15',
            title: 'TOTAL',
            total: '25'
          },
          {
            'Choice 1': '40%',
            'Choice 2': '60%',
            title: '',
            total: '100%'
          }
        ],
      };
      expect(result).toEqual(expectDataOtherCases);
    });
});
  