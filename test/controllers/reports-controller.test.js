const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const ReportController = require(path.resolve(`${dirname}/src/controllers/reports.controller.js`));

const AuditlogRepository = new repositoriesDb.auditlogRepository();
const CriteriaQaCsRepository = new repositoriesDb.criteriaQaCsRepository();
const BadAnalysisFormRepository = new repositoriesDb.badAnalysisFormRepository();
const ResultEvaluateOfBadAnalysisRepository = new repositoriesDb.resultEvaluateOfBadAnalysisRepository();
const AssignmentRepository = new repositoriesDb.assignmentRepository();
const EvaluateRepository = new repositoriesDb.evaluateRepository();
const ResultEvaluateOfCriteriaQaCsRepository = new repositoriesDb.resultEvaluateOfCriteriaQaCsRepository();
const GradesRepository = new repositoriesDb.gradesRepository();
const CriteriaKycRepository = new repositoriesDb.criteriaKycRepository();
const ReportAgentAndTeamPerfRepository = new repositoriesDb.reportAgentAndTeamPerfRepository();
const ReportCompliantAndNoncompliantRepository = new repositoriesDb.reportCompliantAndNoncompliantRepository();
const ReportBadAnalysisRepository = new repositoriesDb.reportBadAnalysisRepository();

const { ReportOfVarianceWithKycUseCase: ReportOfVarianceWithKycUseCaseClass } = require(path.resolve(`${dirname}/src/applications/reports/variance-report.usecase.js`));
const ReportOfVarianceWithKycUseCase = new ReportOfVarianceWithKycUseCaseClass();

const { ReportOfDisputeCollectingUseCase: ReportOfDisputeCollectingUseCaseClass } = require(path.resolve(`${dirname}/src/applications/reports/dispute-collecting-report.usecase.js`));
const ReportOfDisputeCollectingUseCase = new ReportOfDisputeCollectingUseCaseClass();

const { ReportOfFeedbackUseCase: ReportOfFeedbackUseCaseClass } = require(path.resolve(`${dirname}/src/applications/reports/feedback-report.usecase.js`));
const ReportOfFeedbackUseCase = new ReportOfFeedbackUseCaseClass();

const { TrackTypeEnum } = require(path.resolve(`${dirname}/src/constants/forms/track-type.constants`));

let router = ReportController({
  auditlogRepository: AuditlogRepository,
  criteriaQaCsRepository: CriteriaQaCsRepository,
  badAnalysisFormRepository: BadAnalysisFormRepository,
  resultEvaluateOfBadAnalysisRepository: ResultEvaluateOfBadAnalysisRepository,
  assignmentRepository: AssignmentRepository,
  evaluateRepository: EvaluateRepository,
  resultEvaluateOfCriteriaQaCsRepository: ResultEvaluateOfCriteriaQaCsRepository,
  gradesRepository: GradesRepository,
  criteriaKycRepository: CriteriaKycRepository,
  reportAgentAndTeamPerfRepository: ReportAgentAndTeamPerfRepository,
  reportCompliantAndNoncompliantRepository: ReportCompliantAndNoncompliantRepository,
  reportBadAnalysisRepository: ReportBadAnalysisRepository,
  reportOfVarianceWithKycUseCase: ReportOfVarianceWithKycUseCase,
  reportOfDisputeCollectingUseCase: ReportOfDisputeCollectingUseCase,
  reportOfFeedbackUseCase: ReportOfFeedbackUseCase,
});

app.use('/', router);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET /bad-analysis/views/total-bad-analysis', () => {
  const endPoint = '/bad-analysis/views/total-bad-analysis';
  test('return status code 200', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      team: 'ALL'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportTotalBad').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      team: 'ALL',
      groupId: '',
      test: ''
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      team: 'ALL'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportTotalBad').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /bad-analysis/views/team-bad-analysis', () => {
  const endPoint = '/bad-analysis/views/team-bad-analysis';
  test('return status code 200', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportTeamBad').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      startDate: '00/00/0000',
      endDate: '10/06/2023'
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportTeamBad').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /bad-analysis/views/agent-bad-analysis', () => {
  const endPoint = '/bad-analysis/views/agent-bad-analysis';
  test('return status code 200', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      groupId: '63da89d73cb35b764e7c381b',
      reasonForBad: '63da89d73cb35b764e7c381c'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportAgentBad').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      groupId: '63da89d73cb35b764e7c381b',
      reasonForBad: '63da89d73cb35b764e7c381c',
      test: ''
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      formId:'63da89d73cb35b764e7c381a',
      frequency: 'ALL_WK',
      groupId: '63da89d73cb35b764e7c381b',
      reasonForBad: '63da89d73cb35b764e7c381c'
    };
    jest.spyOn(ReportBadAnalysisRepository, 'getReportAgentBad').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /agent-and-team-performance', () => {
  const endPoint = '/agent-and-team-performance';
  test('return status code 200 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      agentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportCriteriaKycByAgent').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      agentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportCriteriaQaCsByAgent').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });

  test('return status code 200 when TrackTypeEnum.KYC without agentId', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportCriteriaKycByTeam').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 when TrackTypeEnum.QA_CS without agentId', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportCriteriaQaCsByTeam').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '00/00/0000',
      endDate: '10/06/2023'
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      agentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportCriteriaKycByAgent').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /qa-performance-by-team/all-date', () => {
  const endPoint = '/qa-performance-by-team/all-date';
  test('return status code 200', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      view: 'ALL_WK'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByTeam').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      view: 'ALL_WK'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByTeam').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /qa-performance-by-team/custom-date', () => {
  const endPoint = '/qa-performance-by-team/custom-date';
  test('return status code 200', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByTeamDateCustom').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is flase', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '00/00/0000'
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByTeamDateCustom').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /qa-performance-by-agent/custom-date', () => {
  const endPoint = '/qa-performance-by-agent/custom-date';
  test('return status code 200', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByAgent').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is flase', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '00/00/0000'
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      qaAgentId: '63da89d73cb35b764e7c381c',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(ReportAgentAndTeamPerfRepository, 'getReportQaPerformanceByAgent').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /compliant-and-noncompliant', () => {
  const endPoint = '/compliant-and-noncompliant';
  test('return status code 200 with TrackTypeEnum.QA_CS and view is WEEK', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023',
      view: 'WEEK'
    };
    jest.spyOn(ReportCompliantAndNoncompliantRepository, 'getReportCriteriaQaCsByWeek').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.KYC and view is WEEK', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023',
      view: 'WEEK'
    };
    jest.spyOn(ReportCompliantAndNoncompliantRepository, 'getReportCriteriaKycByWeek').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.QA_CS and view is DATE', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023',
      view: 'DATE'
    };
    jest.spyOn(ReportCompliantAndNoncompliantRepository, 'getReportCriteriaQaCsByDate').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.KYC and view is DATE', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023',
      view: 'DATE'
    };
    jest.spyOn(ReportCompliantAndNoncompliantRepository, 'getReportCriteriaKycByDate').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });

  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '00/00/0000',
      view: 'DATE'
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023',
      view: 'WEEK'
    };
    jest.spyOn(ReportCompliantAndNoncompliantRepository, 'getReportCriteriaQaCsByWeek').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});



describe('Test on medthod GET /variance', () => {
  const endPoint = '/variance';
  test('return status code 200 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfVarianceWithKycUseCase, 'getVarianceReportOfKyc').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfVarianceWithKycUseCase, 'getVarianceReportOfQaCs').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: ''
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});


describe('Test on medthod GET /dispute-collecting', () => {
  const endPoint = '/dispute-collecting';
  test('return status code 200 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfDisputeCollectingUseCase, 'getDisputeCollectingReportOfKyc').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfDisputeCollectingUseCase, 'getDisputeCollectingReportOfQaCs').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: ''
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});


describe('Test on medthod GET /feedback', () => {
  const endPoint = '/feedback';
  test('return status code 200 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfFeedbackUseCase, 'getFeedbackReportOfKyc').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 200 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReportOfFeedbackUseCase, 'getFeedbackReportOfQaCs').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 400 when validated is false', async () => {
    let response = await request(app).get(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 when dateStart or dateStop isNaN', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: ''
    };
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.KYC', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with TrackTypeEnum.QA_CS', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.QA_CS,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaQaCsRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 500', async () => {
    const mockReq = {
      trackType: TrackTypeEnum.KYC,
      formId: '63da89d73cb35b764e7c381a',
      team: 'TEAM',
      groupId: '63da89d73cb35b764e7c381b',
      startDate: '01/06/2023',
      endDate: '10/06/2023'
    };
    jest.spyOn(CriteriaKycRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    let response = await request(app).get(endPoint).query(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});