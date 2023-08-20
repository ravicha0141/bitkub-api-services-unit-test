require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const  ReportOfBadAnalysisUseCase = require(path.resolve(`${dirname}/src/applications/reports/bad-analysis-report.usecase`));
const reportOfBadAnalysisModel = require(path.resolve(`${dirname}/src/databases/models/reports/bad-analysis-report.model`));
const reportOfBadAnalysisUseCase = new ReportOfBadAnalysisUseCase();
afterEach(() => {
    jest.restoreAllMocks();
});

describe('ReportOfBadAnalysisUseCase', () => {
  describe('createBadAnalysisReportData', () => {
    test('should create success', async () => {
      const mockBadAnalysisData = {
        qaAgentId: 'qaAgentId',
        badAnalysisId: 'badAnalysisId',
        groupId: 'groupId'
      };
      const mockSuccessData = true;
      reportOfBadAnalysisModel.findOne = jest.fn().mockResolvedValue(mockSuccessData);
      const result = await reportOfBadAnalysisUseCase.createBadAnalysisReportData(mockBadAnalysisData);
      expect(result).toEqual(mockSuccessData);
    });
    test('should create when null', async () => {
        const mockBadAnalysisData = {
            qaAgentId: 'qaAgentId',
            badAnalysisId: 'badAnalysisId',
            groupId: 'groupId',
            channelOfBad: {
              referId: '',
              choiceName: ''
            },
            reasonForBad: {
              referId: '',
              choiceName: ''
            },
            issueForBad: {
              referId: '',
              choiceName: ''
            },
            organizationOfBad: {
              referId: '',
              choiceName: ''
            },
          };
          const mockReturnFindOneData = null;
          reportOfBadAnalysisModel.findOne = jest.fn().mockResolvedValue(mockReturnFindOneData);
          const mockReturnCreateData = null;
          reportOfBadAnalysisModel.create = jest.fn().mockResolvedValue(mockReturnCreateData);
          const result = await reportOfBadAnalysisUseCase.createBadAnalysisReportData(mockBadAnalysisData);
          expect(result).toEqual(mockReturnCreateData);
    });
  });
});
