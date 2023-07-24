const moment = require('moment-timezone');
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');
const { DisputeCollectingColumnArray } = require('../../constants/reports/headersColumns.constants');
const { disputeRepository } = require('../../databases/repositories');

class ReportOfDisputeCollectingUseCase {
  constructor() {
    this.disputeRepository = new disputeRepository();
  }

  async getDisputeCollectingReportOfQaCs(formId, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...DisputeCollectingColumnArray];
    const reportData = [];
    const filterVaraince = {};
    filterVaraince['formId'] = formId;
    filterVaraince['trackType'] = TrackTypeEnum.QA_CS;
    filterVaraince['completedDate'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const disputeList = await this.disputeRepository.getListOfDisputesByFilter(filterVaraince);

    for (const disputeData of disputeList) {
      const { completedDate } = disputeData;
      const week = moment(completedDate).week();
      const month = completedDate.getMonth() + 1;
      const propData = {
        ticketNo: disputeData['taskNumber'],
        qaUsername: disputeData['qaAgent'],
        agentEmail: disputeData['agentEmail'],
        superVisorEmail: disputeData['superVisorEmail'] || null,
        agentReason: disputeData['agentReason'],
        qaReason: disputeData['qaReason'],
        week,
        month,
        status: disputeData['disputeStatus'] !== 'agreed' ? (disputeData['disputeStatus'] !== 'disagreed' ? 'na' : 'no') : 'yes',
      };
      reportData.push(propData);
    }
    return { reportHeaders, reportData };
  }

  async getDisputeCollectingReportOfKyc(formId, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...DisputeCollectingColumnArray];
    const reportData = [];
    const filterVaraince = {};
    filterVaraince['formId'] = formId;
    filterVaraince['trackType'] = TrackTypeEnum.KYC;
    filterVaraince['completedDate'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const disputeList = await this.disputeRepository.getListOfDisputesByFilter(filterVaraince);
    for (const disputeData of disputeList) {
      const { completedDate } = disputeData;
      const week = moment(completedDate).week();
      const month = completedDate.getMonth() + 1;
      const propData = {
        ticketNo: disputeData['taskNumber'],
        qaUsername: disputeData['qaAgent'],
        agentEmail: disputeData['agentEmail'],
        superVisorEmail: disputeData['superVisorEmail'] || null,
        agentReason: disputeData['agentReason'],
        qaReason: disputeData['qaReason'],
        week,
        month,
        status: disputeData['disputeStatus'] !== 'agreed' ? (disputeData['disputeStatus'] !== 'disagreed' ? 'na' : 'no') : 'yes',
      };
      reportData.push(propData);
    }
    return { reportHeaders, reportData };
  }
}

module.exports = { ReportOfDisputeCollectingUseCase };
