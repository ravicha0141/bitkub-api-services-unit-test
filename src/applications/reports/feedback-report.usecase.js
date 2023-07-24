const moment = require('moment-timezone');
const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');
const { transformSecond } = require('../../utilities');
const { gradeDefault } = require('../../constants/grade.constants');
const { FeedbackReportColumnArray, FeedbackReportColumnAdditionalArray } = require('../../constants/reports/headersColumns.constants');
const {
  evaluateRepository,
  resultEvaluateOfCriteriaQaCsRepository,
  resultEvaluateOfCriteriaKycRepository,
  criteriaQaCsIssueRepository,
  criteriaQaCsItemQuestionRepository,
} = require('../../databases/repositories');
const GroupRepository = require('../../databases/repositories/groups.repository');

class ReportOfFeedbackUseCase {
  constructor() {
    this.evaluateRepository = new evaluateRepository();
    this.resultEvaluateOfCriteriaQaCsRepository = new resultEvaluateOfCriteriaQaCsRepository();
    this.resultEvaluateOfCriteriaKycRepository = new resultEvaluateOfCriteriaKycRepository();
    this.criteriaQaCsIssueRepository = new criteriaQaCsIssueRepository();
    this.itemQacsService = new criteriaQaCsItemQuestionRepository();
    this.groupRepository = new GroupRepository();
  }

  async getFeedbackReportOfQaCs(formData, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...FeedbackReportColumnArray];
    const reportData = [];
    const filterVaraince = {};
    const { _id: formId, name: formName } = formData;
    filterVaraince['formId'] = formData['_id'].toString();
    filterVaraince['trackType'] = TrackTypeEnum.QA_CS;
    filterVaraince['completedDate'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const evaluateLists = await this.evaluateRepository.getListByFilter(filterVaraince);
    const itemsList = await this.itemQacsService.getListByFilter({ formId });
    itemsList.sort((a, b) => {
      return a.order - b.order;
    });
    const hearderQuestion = itemsList?.map((obj) => `Q${obj['order']}`);
    const hearderComment = itemsList?.map((obj) => `comment${obj['order']}`);
    reportHeaders.push(...hearderQuestion);
    reportHeaders.push(...hearderComment);
    reportHeaders.push(...FeedbackReportColumnAdditionalArray);
    const groupLists = await this.groupRepository.getGroupsWithFilter({});
    for (const evaluateData of evaluateLists) {
      const { _id, netScore, areaOfStrength, areaOfImprovement, groupId } = evaluateData;
      const groupData = groupLists?.find((obj) => obj['_id'].toString() === groupId);
      let groupName = '';
      if (groupData) groupName = groupData['name'];
      const evaluateId = _id.toString();
      const resultList = await this.resultEvaluateOfCriteriaQaCsRepository.getListByFilter({ evaluateId });
      const dateTimeStamp = moment(_id.getTimestamp());
      const week = dateTimeStamp.week();
      const month = dateTimeStamp.month() + 1;
      const monitoringDate = moment.unix(evaluateData['monitoringDate']).format('DD-MM-YYYY');
      const monitoringTime = moment.unix(evaluateData['monitoringDate']).format('HH:mm:ss');
      let voiceTime;
      if (evaluateData['fileType'] === 'voice') {
        voiceTime = transformSecond(evaluateData['fileSize']);
      }
      let headerProp = {};
      let headerPropComment = {};
      for (const item of itemsList) {
        let result = '';
        let commentData = '';
        const foundResutlt = resultList.find((obj) => obj['referId'] === item['_id']);
        if (foundResutlt) {
          result = foundResutlt?.values[2]?.value || '';
          commentData = foundResutlt?.comment || '';
        }
        headerProp[`Q${item['order']}`] = result;
        headerPropComment[`comment${item['order']}`] = commentData;
      }
      let headerScore = {};
      headerScore['P_%'] = netScore;
      const averageGrade = gradeDefault.find(({ max, min }) => netScore <= max && netScore >= min);
      let gradeLabel = '';
      if (averageGrade) {
        gradeLabel = averageGrade.label;
      }
      headerScore['P_Grade'] = gradeLabel;
      const propData = {
        trackType: evaluateData['trackType'],
        formName,
        groupName: groupName,
        month,
        week,
        agentName: evaluateData['agentName'],
        bpo: evaluateData['bpo'],
        uid: evaluateData['uid'],
        ticketNo: evaluateData['taskNumber'],
        assignmentRef: evaluateData?.['assignmentRef'],
        fileType: evaluateData?.['fileType'],
        language: evaluateData['language'],
        dateOfCall: evaluateData['dateOfCall'],
        timeOfCall: evaluateData['timeOfCall'],
        qcOwner: evaluateData['qaAgentEmail'],
        monitoringDate,
        monitoringTime,
        voiceTime,
        ...headerScore,
        ...headerProp,
        ...headerPropComment,
        areaOfStrength,
        areaOfImprovement,
      };
      reportData.push(propData);
    }
    return { reportHeaders, reportData };
  }

  async getFeedbackReportOfKyc(criteriaKycData, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...FeedbackReportColumnArray];
    const reportData = [];
    const filterVaraince = {};
    const { _id: formId, name: formName, listQuestions: questionList } = criteriaKycData;
    questionList.sort((a, b) => {
      return a.order - b.order;
    });
    const hearderQuestion = questionList?.map((obj) => `Q${obj['order']}`);
    const hearderComment = questionList?.map((obj) => `comment${obj['order']}`);
    reportHeaders.push(...hearderQuestion);
    reportHeaders.push(...hearderComment);
    reportHeaders.push(...FeedbackReportColumnAdditionalArray);
    filterVaraince['formId'] = formId.toString();
    filterVaraince['trackType'] = TrackTypeEnum.KYC;
    filterVaraince['completedDate'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const evaluateLists = await this.evaluateRepository.getListByFilter(filterVaraince);
    const groupLists = await this.groupRepository.getGroupsWithFilter({});
    for (const evaluateData of evaluateLists) {
      const { _id, areaOfStrength, areaOfImprovement } = evaluateData;
      const evaluateId = _id.toString();
      const resultData = await this.resultEvaluateOfCriteriaKycRepository.getOneByFilter({ evaluateId });
      if (resultData) {
        const { listQuestions, netScore } = resultData;
        const groupData = groupLists?.find((obj) => obj['_id'].toString() === groupId);
        let groupName = '';
        if (groupData) groupName = groupData['name'];
        const dateTimeStamp = moment(_id.getTimestamp());
        const week = dateTimeStamp.week();
        const month = dateTimeStamp.month() + 1;
        const monitoringDate = moment.unix(evaluateData['monitoringDate']).format('DD-MM-YYYY');
        const monitoringTime = moment.unix(evaluateData['monitoringDate']).format('HH:mm:ss');
        let voiceTime;
        if (evaluateData['fileType'] === 'voice') {
          voiceTime = transformSecond(evaluateData['fileSize']);
        }
        let headerScore = {};
        let headerProp = {};
        let headerCommentProp = {};
        let headerIssues = {};
        let order = 0;
        let errorTypeValue = '';
        let concernIssueValue = '';
        let futherExplanationValue = '';
        for (const question of questionList) {
          order++;
          let result = '';
          let comments = '';
          const foundResutlt = listQuestions.find((obj) => obj['questionId'] === question['_id']);
          if (foundResutlt) {
            result = foundResutlt['result'];
            comments = foundResutlt['qaNoteValue'];
            if (errorTypeValue.length === 0) errorTypeValue = foundResutlt['errorTypeValue'];
            if (concernIssueValue.length === 0) concernIssueValue = foundResutlt['concernIssueValue'];
            if (futherExplanationValue.length === 0) futherExplanationValue = foundResutlt['futherExplanationValue'];
          }
          headerProp[`Q${order}`] = result;
          headerCommentProp[`comment${order}`] = comments;
        }
        headerIssues['errorTypeValue'] = errorTypeValue;
        headerIssues['concernIssueValue'] = concernIssueValue;
        headerIssues['futherExplanationValue'] = futherExplanationValue;
        headerScore['P_%'] = netScore;
        const averageGrade = gradeDefault.find(({ max, min }) => netScore <= max && netScore >= min);
        headerScore['P_Grade'] = averageGrade?.label;
        const propData = {
          trackType: evaluateData?.['trackType'],
          formName,
          groupName: groupName,
          month,
          agentName: evaluateData['agentName'],
          bpo: evaluateData['bpo'],
          uid: evaluateData['uid'],
          ticketNo: evaluateData['taskNumber'],
          assignmentRef: evaluateData?.['assignmentRef'],
          fileType: evaluateData?.['fileType'],
          language: evaluateData['language'],
          dateOfCall: evaluateData?.['dateOfCall'],
          timeOfCall: evaluateData?.['timeOfCall'],
          qcOwner: evaluateData['qaAgentEmail'],
          monitoringDate,
          monitoringTime,
          voiceTime,
          ...headerScore,
          ...headerProp,
          ...headerCommentProp,
          week,
          areaOfStrength,
          areaOfImprovement,
          ...headerIssues,
        };
        reportData.push(propData);
      }
    }
    return { reportHeaders, reportData };
  }
}

module.exports = { ReportOfFeedbackUseCase };
