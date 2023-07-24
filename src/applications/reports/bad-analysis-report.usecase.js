require('dotenv').config();
const reportOfBadAnalysisModel = require('../../databases/models/reports/bad-analysis-report.model');

class ReportOfBadAnalysisUseCase {
  constructor() {}

  async createBadAnalysisReportData(badAnalysisData) {
    const { qaAgentId, badAnalysisId, groupId } = badAnalysisData;
    const badAnalysisReport = await this.findBadAnalysisReport(qaAgentId, badAnalysisId, groupId);
    if (!badAnalysisReport) {
      const records = await this.generateRecords(badAnalysisData);
      const dataForCreate = { ...badAnalysisData, records };
      const badAnalysisReportCreated = await this.create(dataForCreate);
      return badAnalysisReportCreated;
    }
    return badAnalysisReport;
  }

  async findBadAnalysisReport(qaAgentId, badAnalysisId, groupId) {
    return await reportOfBadAnalysisModel
      .findOne({ qaAgentId, badAnalysisId, groupId })
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async create(dataForCreate) {
    return await reportOfBadAnalysisModel
      .create(dataForCreate)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async generateRecords(badAnalysisData) {
    const keys = ['channelOfBad', 'reasonForBad', 'issueForBad', 'organizationOfBad'];
    const newRecords = [];
    for (const key of keys) {
      newRecords.push({
        key,
        value: badAnalysisData[key]['referId'],
        title: badAnalysisData[key]['choiceName'],
      });
    }
    return newRecords;
  }
}

module.exports = ReportOfBadAnalysisUseCase;
