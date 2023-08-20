require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const  { ReportOfDisputeCollectingUseCase } = require(path.resolve(`${dirname}/src/applications/reports/dispute-collecting-report.usecase`));
const reportOfDisputeCollectingUseCase = new ReportOfDisputeCollectingUseCase();
const { disputeModel } = require(path.resolve(`${dirname}/src/databases/models`));
const { TrackTypeEnum } = require(path.resolve(`${dirname}/src/constants/forms/track-type.constants`));
const { DisputeCollectingColumnArray } = require(path.resolve(`${dirname}/src/constants/reports/headersColumns.constants`));

const reportOfBadAnalysisModel = require(path.resolve(`${dirname}/src/databases/models/reports/bad-analysis-report.model`));

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ReportOfBadAnalysisUseCase', () => {
  describe('getDisputeCollectingReportOfQaCs', () => {
    test('should return success data', async () => {
      const formId = 'formId';
      const isHaveGroup = true;
      const groupId = 'groupId';
      const dateStart = '2023-08-01';
      const dateStop = '2023-08-10';
      let mockReturnSuccessData = [
            {
                __v: 0,
                _id: '63920a9805c39ba1f4768284',
                agentEmail: 'minnie.thirawat@bitkub.com',
                agentReason: 'test',
                agentReasonDate: 1670432400,
                assignmentId: '639116130f42d390e69b1e68',
                createdAt: 1670432400,
                createdDateFormat: '2022-12-07T17:00:00.000Z',
                dateOfMonitoring: 1670432400,
                disputeStatus: 'agreed',
                evaluateId: '639116190f42d390e69b1eb6',
                formId: '639115f70f42d390e69b1d63',
                groupId: '635987474b16253803502daa',
                qaAgent: 'agentqa01@bitkub.com',
                qaReason: 'testt',
                qaReasonDate: 1670518800,
                superVisorEmail: 'assisttest01@bitkub.com',
                taskNumber: 'TN-20221208-000003',
                trackType: 'criteria-kyc',
                completedDate: {
                    getMonth: jest.fn().mockResolvedValue(8)
                }
            }
        ];
      jest.spyOn(disputeModel, 'find').mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
      }));
      const result = await reportOfDisputeCollectingUseCase.getDisputeCollectingReportOfQaCs(formId, isHaveGroup, groupId, dateStart, dateStop);
      expect(result.reportHeaders).toEqual([...DisputeCollectingColumnArray]);
    });
  });

  describe('getDisputeCollectingReportOfKyc', () => {
    test('should return success data', async () => {
      const formId = 'formId';
      const isHaveGroup = true;
      const groupId = 'groupId';
      const dateStart = '2023-08-01';
      const dateStop = '2023-08-10';
      let mockReturnSuccessData = [
            {
                __v: 0,
                _id: '63920a9805c39ba1f4768284',
                agentEmail: 'minnie.thirawat@bitkub.com',
                agentReason: 'test',
                agentReasonDate: 1670432400,
                assignmentId: '639116130f42d390e69b1e68',
                createdAt: 1670432400,
                createdDateFormat: '2022-12-07T17:00:00.000Z',
                dateOfMonitoring: 1670432400,
                disputeStatus: 'agreed',
                evaluateId: '639116190f42d390e69b1eb6',
                formId: '639115f70f42d390e69b1d63',
                groupId: '635987474b16253803502daa',
                qaAgent: 'agentqa01@bitkub.com',
                qaReason: 'testt',
                qaReasonDate: 1670518800,
                superVisorEmail: 'assisttest01@bitkub.com',
                taskNumber: 'TN-20221208-000003',
                trackType: 'criteria-kyc',
                completedDate: {
                    getMonth: jest.fn().mockResolvedValue(8)
                }
            }
        ];
      jest.spyOn(disputeModel, 'find').mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
      }));
      const result = await reportOfDisputeCollectingUseCase.getDisputeCollectingReportOfKyc(formId, isHaveGroup, groupId, dateStart, dateStop);
      expect(result.reportHeaders).toEqual([...DisputeCollectingColumnArray]);
    });
  });
});
