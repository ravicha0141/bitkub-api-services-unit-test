const { TrackTypeEnum } = require('../../constants/forms/track-type.constants');
const { VariancesColumnArray } = require('../../constants/reports/headersColumns.constants');
const {
  assignmentRepository,
  evaluateRepository,
  varianceRepository,
  criteriaKycRepository,
  resultEvaluateOfCriteriaKycRepository,
  resultEvaluateOfCriteriaQaCsRepository,
  criteriaQaCsItemQuestionRepository,
} = require('../../databases/repositories');
const { UserRoleEnum } = require('../../constants/settings.constants');
const { ConvertDifferenceValue } = require('../../utilities/variances.util');

class ReportOfVarianceWithKycUseCase {
  constructor() {
    this.assignmentRepository = new assignmentRepository();
    this.evaluateRepository = new evaluateRepository();
    this.varianceRepository = new varianceRepository();
    this.criteriaKycRepository = new criteriaKycRepository();
    this.resultEvaluateQaCsService = new resultEvaluateOfCriteriaQaCsRepository();
    this.resultOfItemQaCsService = new criteriaQaCsItemQuestionRepository();
    this.resultEvaluateKycService = new resultEvaluateOfCriteriaKycRepository();
  }

  async getVarianceReportOfQaCs(formId, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...VariancesColumnArray];
    const itemList = await this.resultOfItemQaCsService.getListByFilter({ formId });
    itemList.sort((a, b) => {
      return a?.order - b?.order;
    });
    const headerSets = itemList.reduce((obj, cur) => ({ ...obj, [cur._id]: `${cur['order']}) ${cur['title']}` }), {});
    const additionalHeaders = itemList.map((obj) => `${obj['order']}) ${obj['title']}`);
    const additionalHeadersOfComment = itemList.map((obj) => `${obj['order']}) comment`);
    const additionalHeadersOfSupComment = itemList.map((obj) => `${obj['order']}) sup comment`);
    reportHeaders.push('Task No.');
    reportHeaders.push(...additionalHeaders);
    reportHeaders.push(...additionalHeadersOfComment);
    reportHeaders.push(...additionalHeadersOfSupComment);
    reportHeaders.push('diff');
    const filterVaraince = {};
    filterVaraince['formId'] = formId;
    filterVaraince['trackType'] = TrackTypeEnum.QA_CS;
    filterVaraince['createdAt'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const variancedList = await this.varianceRepository.getListByFilter(filterVaraince);
    const reportData = [];
    for (const variance of variancedList) {
      const { evaluateId, superVisorEmail, qaAgentEmail, taskNumber, differenceValue, _id: varianceId } = variance;
      const listResultQaCsData = await this.resultEvaluateQaCsService.getListByFilter({ evaluateId });
      const varianceResultOfQaAgent = {
        level: UserRoleEnum.QA_AGENT,
        inspection: qaAgentEmail,
      };

      const varianceResultOfSupQa = {
        level: UserRoleEnum.SUPER_VISOR,
        inspection: superVisorEmail,
      };
      let additionalQuestionRecord = {};
      let additionalQuestionOfSupQa = {};
      let additionalQuestionRecordOfComment = {};
      let additionalQuestionOfSupQaOfComment = {};
      additionalQuestionRecord['Task No.'] = taskNumber;
      additionalQuestionOfSupQa['Task No.'] = taskNumber;
      const arrayVarianceList = [];
      for (const result of listResultQaCsData) {
        const { values, comment, referOrder } = result;
        const foundResutlt = values[values.findIndex((obj) => obj['field'] === 'selectType')];
        const foundVarainceResutlt = values[values.findIndex((obj) => obj['field'] === 'varianceResult')];
        const foundSupQaComment = values[values.findIndex((obj) => obj['field'] === 'supQaComment')];
        let agreeValueString = '-';
        if (typeof foundVarainceResutlt?.value === 'boolean' && foundVarainceResutlt?.value === true) agreeValueString = 'agree';
        else if (typeof foundVarainceResutlt?.value === 'boolean' && foundVarainceResutlt?.value === false) agreeValueString = 'disagree';

        arrayVarianceList.push(agreeValueString);
        additionalQuestionRecord[`${headerSets[`${result['referId']}`]}`] = foundResutlt?.value || null;
        additionalQuestionOfSupQa[`${headerSets[`${result['referId']}`]}`] = agreeValueString;
        additionalQuestionRecordOfComment[`${referOrder}) comment`] = '-';
        additionalQuestionRecordOfComment[`${referOrder}) sup comment`] = '-';
        additionalQuestionOfSupQaOfComment[`${referOrder}) comment`] = comment;
        additionalQuestionOfSupQaOfComment[`${referOrder}) sup comment`] = foundSupQaComment?.value || '-';
      }
      const isVarianceNotSubmit = arrayVarianceList.every((ele) => ele === '-');
      const diffVal = ConvertDifferenceValue(
        (arrayVarianceList.filter((val) => val === 'disagree').length * 100) / arrayVarianceList.length,
      );
      if (differenceValue !== diffVal) {
        await this.varianceRepository.update(varianceId, { differenceValue: diffVal });
      }
      additionalQuestionRecord['diff'] = '-';
      additionalQuestionOfSupQa['diff'] = isVarianceNotSubmit ? '-' : `${(diffVal / 100)?.toFixed(2)}`;
      reportData.push({ ...varianceResultOfQaAgent, ...additionalQuestionRecord, ...additionalQuestionRecordOfComment });
      reportData.push({ ...varianceResultOfSupQa, ...additionalQuestionOfSupQa, ...additionalQuestionOfSupQaOfComment });
    }
    return { reportHeaders, reportData };
  }

  async getVarianceReportOfKyc(criteriaKycFormData, formId, isHaveGroup, groupId, dateStart, dateStop) {
    const reportHeaders = [...VariancesColumnArray];
    const listQuestionsOfForm = criteriaKycFormData?.listQuestions;
    const headerSets = listQuestionsOfForm.reduce((obj, cur) => ({ ...obj, [cur._id]: `${cur['order']}) ${cur['title']}` }), {});
    const additionalHeaders = listQuestionsOfForm.map((obj) => `${obj['order']}) ${obj['title']}`);
    const additionalComments = listQuestionsOfForm.map((obj) => `${obj['order']}) comment`);
    const additionalSupComments = listQuestionsOfForm.map((obj) => `${obj['order']}) sup comment`);
    listQuestionsOfForm.sort((a, b) => {
      return a.order - b.order;
    });
    reportHeaders.push('Task No.');
    reportHeaders.push(...additionalHeaders);
    reportHeaders.push(...additionalComments);
    reportHeaders.push(...additionalSupComments);
    reportHeaders.push('diff');
    const filterVaraince = {};
    filterVaraince['formId'] = formId;
    filterVaraince['trackType'] = TrackTypeEnum.KYC;
    filterVaraince['createdAt'] = {
      $gt: dateStart,
      $lt: dateStop,
    };
    if (isHaveGroup) filterVaraince['groupId'] = groupId;
    const variancedList = await this.varianceRepository.getListByFilter(filterVaraince);
    const resultEvaluateList = await this.resultEvaluateKycService.getListByFilter({ trackType: TrackTypeEnum.KYC });
    const reportData = [];
    for (const result of resultEvaluateList) {
      const { evaluateId, listQuestions } = result;
      const foundVariance = await variancedList.find((obj) => obj['evaluateId'] === evaluateId);
      if (foundVariance) {
        const { superVisorEmail, qaAgentEmail, taskNumber, differenceValue, _id: varianceId } = foundVariance;
        const varianceResultOfQaAgent = {
          level: UserRoleEnum.QA_AGENT,
          inspection: qaAgentEmail,
        };
        varianceResultOfQaAgent['Task No.'] = taskNumber;
        const varianceResultOfSupQa = {
          level: UserRoleEnum.SUPER_VISOR,
          inspection: superVisorEmail,
        };
        varianceResultOfSupQa['Task No.'] = taskNumber;
        let additionalQuestionRecord = {};
        let additionalQuestionRecordOfComment = {};
        let additionalQuestionOfSupQa = {};
        let additionalQuestionOfComment = {};
        additionalQuestionRecord['diff'] = '-';
        const arrayVarianceList = [];
        for (const question of listQuestions) {
          const questionData = listQuestionsOfForm.find((obj) => obj?._id === question?.questionId);
          let agreeValueString = '-';
          if (typeof question['varianceResult'] === 'boolean' && question['varianceResult'] === true) agreeValueString = 'agree';
          else if (typeof question['varianceResult'] === 'boolean' && question['varianceResult'] === false) agreeValueString = 'disagree';
          arrayVarianceList.push(agreeValueString);
          additionalQuestionRecord[`${headerSets[`${question['questionId']}`]}`] = question['result'] || null;
          additionalQuestionOfSupQa[`${headerSets[`${question['questionId']}`]}`] = agreeValueString;
          additionalQuestionRecordOfComment[`${questionData?.order}) comment`] = '-';
          additionalQuestionRecordOfComment[`${questionData?.order}) sup comment`] = '-';
          additionalQuestionOfComment[`${questionData?.order}) comment`] = question?.comments.join(',');
          additionalQuestionOfComment[`${questionData?.order}) sup comment`] = question?.supQaComment || '-';
        }
        const isVarianceNotSubmit = arrayVarianceList.every((ele) => ele === '-');
        const diffVal = ConvertDifferenceValue(
          (arrayVarianceList.filter((val) => val === 'disagree').length * 100) / arrayVarianceList.length,
        );
        if (differenceValue !== diffVal) {
          await this.varianceRepository.update(varianceId, { differenceValue: ConvertDifferenceValue(diffVal) });
        }
        additionalQuestionOfComment['diff'] = isVarianceNotSubmit ? '-' : `${(diffVal / 100)?.toFixed(2)}`;
        reportData.push({ ...varianceResultOfQaAgent, ...additionalQuestionRecord, ...additionalQuestionRecordOfComment });
        reportData.push({ ...varianceResultOfSupQa, ...additionalQuestionOfSupQa, ...additionalQuestionOfComment });
      }
    }
    return { reportHeaders, reportData };
  }
}

module.exports = { ReportOfVarianceWithKycUseCase };
