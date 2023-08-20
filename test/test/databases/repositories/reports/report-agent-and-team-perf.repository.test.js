require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { reportAgentAndTeamPerfRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));
const { gradeDefault } = require(path.resolve(`${dirname}/src/constants/grade.constants`));
const FREQUENCY_TYPE = { WEEK: 'ALL_WK', MONTH: 'ALL_MM', YEAR: 'ALL_YEAR' };

let dbUserModel = dbModels.userModel;
let dbResultEvaluateOfQaCsModel = dbModels.resultEvaluateOfQaCsModel;
let dbEvaluateModel = dbModels.evaluateModel;
let dbResultEvaluateOfKycModel = dbModels.resultEvaluateOfKycModel;
const ReportAgentAndTeamPerfRepository = new reportAgentAndTeamPerfRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getReportCriteriaKycByTeam', () => {
  test('Test get List By Filter success', async () => {
    const mockEvaluateData = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        agentId: '63a3cc2aa934f7bb58bf750d',
        agentName: 'name1',
        agentEmail: 'test1@bitkub.com',
        percentage: 20
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        agentId: '63a3cc2aa934f7bb58bf750c',
        agentName: 'name2',
        agentEmail: 'test2@bitkub.com',
        percentage: 21
      }
    ];
    jest.spyOn(dbEvaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockEvaluateData),
    }));
    const mockResultData = [
      {
        evaluateId: '63a3cc2aa934f7bb58bf750d',
        listQuestions: [
          {
            result: 'yes',
            order: 1
          },
          {
            result: 'yes',
            order: 2
          }
        ]
      },
      {
        evaluateId: '63a3cc2aa934f7bb58bf750c',
        listQuestions: [
          {
            result: 'no',
            order: 1
          },
          {
            result: 'no',
            order: 2
          }
        ]
      }
    ];
    jest.spyOn(dbResultEvaluateOfKycModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockResultData),
    }));
    jest.spyOn(gradeDefault, 'find').mockReturnValue({
      label: ''
    });
    const expectData = {
      reportHeaders: [ '1', '2' ],
      reportData: [
        {
          '1': '50%',
          '2': '50%',
          agentId: '63a3cc2aa934f7bb58bf750d',
          agentName: 'name1',
          agentEmail: 'test1@bitkub.com',
          average: '10%',
          grade: 'Out of range'
        },
        {
          '1': '0%',
          '2': '0%',
          agentId: '63a3cc2aa934f7bb58bf750c',
          agentName: 'name2',
          agentEmail: 'test2@bitkub.com',
          average: '10.5%',
          grade: 'Out of range'
        }
      ]
    };
    expect(await ReportAgentAndTeamPerfRepository.getReportCriteriaKycByTeam({})).toEqual(expectData);
  });
});

describe('getReportCriteriaQaCsByTeam', () => {
  test('Test get List By Filter success', async () => {
    const mockEvaluateData = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        agentId: '63a3cc2aa934f7bb58bf750d',
        agentName: 'name1',
        agentEmail: 'test1@bitkub.com',
        percentage: 20
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        agentId: '63a3cc2aa934f7bb58bf750c',
        agentName: 'name2',
        agentEmail: 'test2@bitkub.com',
        percentage: 21
      }
    ];
    jest.spyOn(dbEvaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockEvaluateData),
    }));
    const mockResultData = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        questionList: [
          {
            answer: 'yes',
            referOrder: 'test1'
          },
          {
            answer: 'yes',
            referOrder: 'test2'
          }
        ]
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        questionList: [
          {
            answer: 'no',
            referOrder: 'test1'
          },
          {
            answer: 'no',
            referOrder: 'test2'
          }
        ]
      }
    ];
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'aggregate').mockImplementationOnce(() => {
      return Promise.resolve(mockResultData);
    });
    jest.spyOn(gradeDefault, 'find').mockReturnValue({
      label: ''
    });
    const expectData = {
      reportHeaders: [ 'test1', 'test2' ],
      reportData: [
        {
          agentId: '63a3cc2aa934f7bb58bf750d',
          agentName: 'name1',
          agentEmail: 'test1@bitkub.com',
          average: '10%',
          grade: 'Out of range',
          "test1": "50%",
          "test2": "50%"
        },
        {
          agentId: '63a3cc2aa934f7bb58bf750c',
          agentName: 'name2',
          agentEmail: 'test2@bitkub.com',
          average: '10.5%',
          grade: 'Out of range',
          "test1": "0%",
          "test2": "0%"
        }
      ]
    };
    const result = await ReportAgentAndTeamPerfRepository.getReportCriteriaQaCsByTeam({});
    expect(result).toEqual(expectData);
  });
});

describe('getReportCriteriaKycByAgent', () => {
  test('Test get List By Filter success', async () => {
    const mockEvaluateData = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        agentId: '63a3cc2aa934f7bb58bf750d',
        agentName: 'name1',
        agentEmail: 'test1@bitkub.com',
        taskNumber: '',
        percentage: '20'
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        agentId: '63a3cc2aa934f7bb58bf750c',
        agentName: 'name2',
        agentEmail: 'test2@bitkub.com',
        taskNumber: '',
        percentage: '21'
      }
    ];
    jest.spyOn(dbEvaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockEvaluateData),
    }));
    const mockResultData = [
      {
        evaluateId: '63a3cc2aa934f7bb58bf750d',
        listQuestions: [
          {
            result: 'yes',
            order: 1
          },
          {
            result: 'yes',
            order: 2
          }
        ]
      },
      {
        evaluateId: '63a3cc2aa934f7bb58bf750c',
        listQuestions: [
          {
            result: 'no',
            order: 1
          },
          {
            result: 'no',
            order: 2
          }
        ]
      }
    ];
    jest.spyOn(dbResultEvaluateOfKycModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockResultData),
    }));
    jest.spyOn(gradeDefault, 'find').mockReturnValue({
      label: ''
    });
    const expectData = {
      reportData: [
        {
          "1": "100%",
          "2": "100%",
          agentEmail: 'test1@bitkub.com',
          agentName: 'name1',
          average: '20%',
          grade: 'Out of range',
          taskNumber: ""
        },
        {
          "1": "0%",
          "2": "0%",
          agentName: 'name2',
          agentEmail: 'test2@bitkub.com',
          average: '21%',
          grade: 'Out of range',
          taskNumber: ""
        }
      ],
      reportHeaders: [ '1', '2' ]
    };
    const result = await ReportAgentAndTeamPerfRepository.getReportCriteriaKycByAgent({});
    expect(result).toEqual(expectData);
  });
});

describe('getReportCriteriaQaCsByAgent', () => {
  test('Test get List By Filter success', async () => {
    const mockEvaluateData = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        agentId: '63a3cc2aa934f7bb58bf750d',
        agentName: 'name1',
        agentEmail: 'test1@bitkub.com',
        taskNumber: 'TN-20221127-000001',
        percentage: 20
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        agentId: '63a3cc2aa934f7bb58bf750c',
        agentName: 'name2',
        agentEmail: 'test2@bitkub.com',
        taskNumber: 'TN-20221127-000002',
        percentage: 30
      }
    ];
    jest.spyOn(dbEvaluateModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockEvaluateData),
    }));
    const mockGroupedResults = [
      {
        _id: '63a3cc2aa934f7bb58bf750d',
        questionList: [
          {
            answer: 'yes',
            referOrder: 'test1'
          },
          {
            answer: 'yes',
            referOrder: 'test2'
          }
        ]
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        questionList: [
          {
            answer: 'no',
            referOrder: 'test1'
          },
          {
            answer: 'no',
            referOrder: 'test2'
          }
        ]
      }
    ];
    jest.spyOn(dbResultEvaluateOfQaCsModel, 'aggregate').mockImplementationOnce(() => {
      return Promise.resolve(mockGroupedResults);
    });
    jest.spyOn(gradeDefault, 'find').mockReturnValue({
      label: ''
    });

    const expectData = {
      reportHeaders: [ 'test1', 'test2' ],
      reportData: [
        {
          agentName: 'name1',
          agentEmail: 'test1@bitkub.com',
          taskNumber: 'TN-20221127-000001',
          average: '20%',
          grade: 'Out of range',
          test1: '100%',
          test2: '100%'
        },
        {
          agentName: 'name2',
          agentEmail: 'test2@bitkub.com',
          taskNumber: 'TN-20221127-000002',
          average: '30%',
          grade: 'Out of range',
          test1: '0%',
          test2: '0%'
        }
      ]
    };
    const result = await ReportAgentAndTeamPerfRepository.getReportCriteriaQaCsByAgent({});
    expect(result).toEqual(expectData);
  });
});

describe('getReportQaPerformanceByTeam', () => {
  test('for WEEK frequency', async () => {
    const mockEvaluateData = [
      {
        _id: '1',
        totalScore: 20,
        count: 20
      },
      {
        _id: '2',
        totalScore: 20,
        count: 20
      }
    ];
    jest.spyOn(dbEvaluateModel, 'aggregate').mockResolvedValue(mockEvaluateData);
    const result = await ReportAgentAndTeamPerfRepository.getReportQaPerformanceByTeam(FREQUENCY_TYPE.WEEK, {});
    expect(result.reportHeaders).toEqual(['Week', 'Count', 'Score']);
  });
  test('for MONTH frequency', async () => {
    const mockEvaluateData = [
      {
        _id: '1',
        totalScore: 20,
        count: 20
      },
      {
        _id: '2',
        totalScore: 20,
        count: 20
      }
    ];
    jest.spyOn(dbEvaluateModel, 'aggregate').mockResolvedValue(mockEvaluateData);
    const result = await ReportAgentAndTeamPerfRepository.getReportQaPerformanceByTeam(FREQUENCY_TYPE.MONTH, {});
    expect(result.reportHeaders).toEqual(['Month', 'Quarter', 'Productivity', 'Score']);
  });

  test('for YEAR frequency', async () => {
    const mockEvaluateData = [
      {
        _id: '1',
        totalScore: 20,
        count: 20
      },
      {
        _id: '5',
        totalScore: 40,
        count: 20
      },
      {
        _id: '7',
        totalScore: 60,
        count: 20
      }
    ];
    jest.spyOn(dbEvaluateModel, 'aggregate').mockResolvedValue(mockEvaluateData);
    const result = await ReportAgentAndTeamPerfRepository.getReportQaPerformanceByTeam(FREQUENCY_TYPE.YEAR, {});
    expect(result.reportHeaders).toEqual(['Quarter', 'Productivity', 'Score']);
  });
});


describe('getReportQaPerformanceByTeamDateCustom', () => {
  test('return data success', async () => {
    const mockEvaluateData = [
      {
        _id: {
          day: '1',
          month: '1',
          year: '2023',
        },
        totalScore: 20,
        count: 20
      },
      {
        _id: {
          day: '1',
          month: '2',
          year: '2023',
        },
        totalScore: 40,
        count: 20
      }
    ];
    jest.spyOn(dbEvaluateModel, 'aggregate').mockResolvedValue(mockEvaluateData);
    const result = await ReportAgentAndTeamPerfRepository.getReportQaPerformanceByTeamDateCustom({});
    expect(result.reportHeaders).toEqual(['dd/mm/yyyy', 'Count', 'Score']);
  });
});

describe('getReportQaPerformanceByAgent', () => {
  test('return data success', async () => {
    const mockEvaluateData = [
      {
        _id: '63a3cc2aa934f7bb58bf750b',
        totalScore: 20,
        count: 20
      },
      {
        _id: '63a3cc2aa934f7bb58bf750c',
        totalScore: 40,
        count: 20
      }
    ];
    jest.spyOn(dbEvaluateModel, 'aggregate').mockResolvedValue(mockEvaluateData);
    const mockUserData = [
      {
        _id: '63a3cc2aa934f7bb58bf750b',
        username: 'test1',
        email: 'test1@bitkub.com'
      },
      {
        _id: '63a3cc2aa934f7bb58bf750e',
        username: 'test2',
        email: 'test2@bitkub.com'
      }
    ];
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockUserData),
    }));
    
    const result = await ReportAgentAndTeamPerfRepository.getReportQaPerformanceByAgent({});
    expect(result.reportHeaders).toEqual(['Username', 'QA Email', 'Actual']);
  });
});

