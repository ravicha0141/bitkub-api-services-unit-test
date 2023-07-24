const __dir = require('app-root-path');
const moment = require('moment-timezone');
const { userModel, resultEvaluateOfQaCsModel, evaluateModel, resultEvaluateOfKycModel } = require('../../models');
const { gradeDefault } = require(`${__dir}/src/constants/grade.constants`);
const FREQUENCY_TYPE = { WEEK: 'ALL_WK', MONTH: 'ALL_MM', YEAR: 'ALL_YEAR' };
const CURRENT_YEAR = () => moment().tz('Asia/Bangkok').startOf('year').toDate();

class ReportOfAgentAndTeamPerformanceRepository {
  constructor() {}

  async getReportCriteriaKycByTeam(evaluateFilter) {
    const evaluateData = await evaluateModel.find(evaluateFilter, 'agentId agentName agentEmail percentage').lean();
    const evaluateMap = evaluateData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());
    const resultData = await resultEvaluateOfKycModel.find({ evaluateId: { $in: Array.from(evaluateMap.keys()) } }).lean();
    const reportHeaders =
      resultData.length == 0 ? [] : resultData[0].listQuestions.map(({ order }, inx) => String(order ? order : inx + 1));

    const mapRawData = resultData.reduce((acc, { evaluateId, listQuestions }) => {
      const { agentId, agentName, agentEmail, percentage } = evaluateMap.get(evaluateId) || {};
      let { agentResult, sumAvgScore } = acc.get(agentId) || {
        agentResult: { agentId, agentName: agentName || '-', agentEmail },
        sumAvgScore: 0,
      };
      sumAvgScore += Number(percentage);

      listQuestions.every(({ order, result }, inx) => {
        const questionNumber = order ? order : inx + 1;
        const agentQuestionScore = agentResult[questionNumber] || 0;
        if (result == 'yes') {
          agentResult[questionNumber] = agentQuestionScore + 1;
        } else agentResult[questionNumber] = agentQuestionScore;
        return true;
      });

      return acc.set(agentId, { agentResult, sumAvgScore });
    }, new Map());

    const reportData = [];
    const amountOfEvaluate = evaluateMap.size;
    for (const { agentResult, sumAvgScore } of mapRawData.values()) {
      const agentScore = reportHeaders.reduce((acc, questionOrder) => {
        acc[questionOrder] = (agentResult[questionOrder] / amountOfEvaluate).toLocaleString('en', {
          maximumFractionDigits: 2,
          style: 'percent',
        });
        return acc;
      }, {});
      const averagePercent = sumAvgScore / amountOfEvaluate;

      const averageGrade = gradeDefault.find(({ max, min }) => averagePercent <= max && averagePercent >= min);
      const grade = averageGrade?.label || 'Out of range';

      const average = averagePercent.toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
      reportData.push({
        agentId: agentResult.agentId,
        agentName: agentResult.agentName,
        agentEmail: agentResult.agentEmail,
        average,
        grade,
        ...agentScore,
      });
    }

    return {
      reportHeaders,
      reportData: reportData.sort((a, b) => a.agentName.localeCompare(b.agentName)),
    };
  }

  async getReportCriteriaQaCsByTeam(evaluateFilter) {
    const evaluateData = await evaluateModel.find(evaluateFilter, 'agentId agentName agentEmail percentage').lean();
    const evaluateMap = evaluateData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());
    const resultsData = await resultEvaluateOfQaCsModel.aggregate([
      { $match: { evaluateId: { $in: Array.from(evaluateMap.keys()) } } },
      {
        $group: {
          _id: '$evaluateId',
          questionList: {
            $push: {
              referOrder: '$referOrder',
              answer: {
                $arrayElemAt: ['$values.value', 2],
              },
            },
          },
        },
      },
    ]);

    const mapRawData = resultsData.reduce((acc, { _id: evalId, questionList }) => {
      const { agentId, agentName, agentEmail, percentage } = evaluateMap.get(evalId) || {};
      let { agentResult, sumAvgScore } = acc.get(agentId) || {
        agentResult: { agentId, agentName: agentName || '-', agentEmail },
        sumAvgScore: 0,
      };
      sumAvgScore += Number(percentage);

      questionList.every(({ referOrder, answer }) => {
        const agentQuestionScore = agentResult[referOrder] || 0;
        if (answer === 'yes') {
          agentResult[referOrder] = agentQuestionScore + 1;
        } else agentResult[referOrder] = agentQuestionScore;

        return true;
      });

      return acc.set(agentId, { agentResult, sumAvgScore });
    }, new Map());
    const reportHeaders = resultsData.length == 0 ? [] : resultsData[0].questionList.map(({ referOrder }) => referOrder);

    const reportData = [];
    const amountOfEvaluate = evaluateMap.size;
    for (const { agentResult, sumAvgScore } of mapRawData.values()) {
      const agentScore = reportHeaders.reduce((acc, referOrder) => {
        acc[referOrder] = (agentResult[referOrder] / amountOfEvaluate).toLocaleString('en', {
          maximumFractionDigits: 2,
          style: 'percent',
        });
        return acc;
      }, {});
      const averagePercent = sumAvgScore / amountOfEvaluate;
      const averageGrade = gradeDefault.find(({ max, min }) => averagePercent <= max && averagePercent >= min);
      const grade = averageGrade?.label || 'Out of range';

      const average = averagePercent.toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
      reportData.push({
        agentId: agentResult.agentId,
        agentName: agentResult.agentName,
        agentEmail: agentResult.agentEmail,
        average,
        grade,
        ...agentScore,
      });
    }

    return {
      reportHeaders: reportHeaders.sort((a, b) => a.localeCompare(b)),
      reportData: reportData.sort((a, b) => a.agentName.localeCompare(b.agentName)),
    };
  }

  async getReportCriteriaKycByAgent(evaluateFilter) {
    const evaluateData = await evaluateModel.find(evaluateFilter, 'agentId agentName agentEmail taskNumber percentage').lean();
    const evaluateMap = evaluateData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());

    const resultData = await resultEvaluateOfKycModel.find({ evaluateId: { $in: Array.from(evaluateMap.keys()) } }).lean();
    const reportHeaders =
      resultData.length == 0 ? [] : resultData[0].listQuestions.map(({ order }, inx) => String(order ? order : inx + 1));

    const reportData = resultData.map(({ evaluateId, listQuestions }) => {
      const { agentName, agentEmail, taskNumber, percentage } = evaluateMap.get(evaluateId) || {};

      const agentResult = listQuestions.reduce((acc, { order, result }, inx) => {
        const questionNumber = order ? order : inx + 1;
        if (result === 'yes') {
          acc[questionNumber] = '100%';
        } else if (result === 'unconclude') acc[questionNumber] = 'unconclude';
        else acc[questionNumber] = '0%';
        return acc;
      }, {});

      const averageGrade = gradeDefault.find(({ max, min }) => percentage <= max && percentage >= min);
      const grade = averageGrade?.label || 'Out of range';

      return {
        agentName: agentName || '-',
        agentEmail,
        taskNumber,
        average: percentage.toLocaleString('en', { maximumFractionDigits: 2 }) + '%',
        grade,
        ...agentResult,
      };
    });
    return { reportHeaders, reportData: reportData.sort((a, b) => a.taskNumber.localeCompare(b.taskNumber)) };
  }

  async getReportCriteriaQaCsByAgent(evaluateFilter) {
    const evaluateData = await evaluateModel.find(evaluateFilter, 'agentId agentName agentEmail taskNumber percentage').lean();
    const evaluateMap = evaluateData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());
    const groupedResults = await resultEvaluateOfQaCsModel.aggregate([
      { $match: { evaluateId: { $in: Array.from(evaluateMap.keys()) } } },
      {
        $group: {
          _id: '$evaluateId',
          questionList: {
            $push: {
              referOrder: '$referOrder',
              answer: { $arrayElemAt: ['$values.value', 2] },
            },
          },
        },
      },
    ]);

    const reportData = groupedResults.map(({ _id: evalId, questionList }) => {
      const { agentName, agentEmail, taskNumber, percentage } = evaluateMap.get(evalId) || {};
      console.log(evalId, percentage);
      const agentResult = questionList.reduce((acc, { referOrder, answer }) => {
        if (answer === 'yes') acc[referOrder] = '100%';
        else if (answer === 'na') acc[referOrder] = 'N/A';
        else acc[referOrder] = '0%';
        return acc;
      }, {});

      const averageGrade = gradeDefault.find(({ max, min }) => percentage <= max && percentage >= min);
      const grade = averageGrade?.label || 'Out of range';

      return {
        agentName: agentName || '-',
        agentEmail,
        taskNumber,
        average: percentage.toLocaleString('en', { maximumFractionDigits: 2 }) + '%',
        grade,
        ...agentResult,
      };
    });
    const reportHeaders = groupedResults.length == 0 ? [] : groupedResults[0].questionList.map(({ referOrder }) => referOrder);

    return {
      reportHeaders: reportHeaders.sort((a, b) => a.localeCompare(b)),
      reportData: reportData.sort((a, b) => a.taskNumber.localeCompare(b.taskNumber)),
    };
  }

  async getReportQaPerformanceByTeam(frequency, evaluateFilter) {
    evaluateFilter.$expr = { $gt: ['$completedDate', CURRENT_YEAR()] };

    const evaluateData = await evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: frequency == FREQUENCY_TYPE.WEEK ? { $week: '$modifiedDate' } : { $month: '$modifiedDate' },
          totalScore: {
            $sum: '$percentage',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let reportHeaders = [];
    let reportData = [];
    if (frequency == FREQUENCY_TYPE.WEEK) {
      reportHeaders = ['Week', 'Count', 'Score'];
      reportData = Array.from({ length: 53 }, (_, i) => {
        return { Week: 'W'.concat(i + 1), Count: '0', Score: '0%' };
      });
      console.log(evaluateData);
      evaluateData.every(({ _id: weekNumber, totalScore, count }) => {
        reportData[weekNumber].Count = count.toLocaleString('en');
        reportData[weekNumber].Score = (totalScore / count).toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
        return true;
      });
    } else if (frequency == FREQUENCY_TYPE.MONTH) {
      const monthNameList = moment.monthsShort();
      reportHeaders = ['Month', 'Quarter', 'Productivity', 'Score'];
      reportData = Array.from({ length: 12 }, (_, i) => {
        let Quarter = '4';
        if (i < 3) {
          Quarter = '1';
        } else if (i < 6) {
          Quarter = '2';
        } else if (i < 9) {
          Quarter = '3';
        }
        return {
          Month: monthNameList[i],
          Quarter,
          Productivity: '0',
          Score: '0',
        };
      });
      evaluateData.every(({ _id: monthNumber, totalScore, count }) => {
        const monthIndex = monthNumber - 1;
        reportData[monthIndex].Productivity = count.toLocaleString('en');
        reportData[monthIndex].Score = (totalScore / count).toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
        return true;
      });
    } else if (frequency == FREQUENCY_TYPE.YEAR) {
      reportHeaders = ['Quarter', 'Productivity', 'Score'];
      reportData = Array.from({ length: 4 }, (_, i) => {
        return {
          Quarter: 'Q'.concat(i + 1),
          Productivity: '0',
          Score: '0',
        };
      });
      const mapTotalScoreByQuarter = evaluateData.reduce((acc, { _id: month, totalScore, count }) => {
        let quarter = 3;
        if (month <= 3) {
          quarter = 0;
        } else if (month <= 6) {
          quarter = 1;
        } else if (month <= 9) {
          quarter = 2;
        }
        const { sumAvgScore, totalCount } = acc.get(quarter) || { sumAvgScore: 0, totalCount: 0 };
        return acc.set(quarter, { sumAvgScore: sumAvgScore + totalScore, totalCount: totalCount + count });
      }, new Map());

      for (const [quarterIndex, { sumAvgScore, totalCount }] of mapTotalScoreByQuarter.entries()) {
        if (reportData.length > quarterIndex) {
          reportData[quarterIndex].Productivity = totalCount.toLocaleString('en');
          reportData[quarterIndex].Score = (sumAvgScore / totalCount).toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
        }
      }
    }

    return {
      reportHeaders,
      reportData,
    };
  }

  async getReportQaPerformanceByTeamDateCustom(evaluateFilter) {
    const evaluateData = await evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$modifiedDate' },
            month: { $month: '$modifiedDate' },
            year: { $year: '$modifiedDate' },
          },
          totalScore: {
            $sum: '$percentage',
          },
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const reportHeaders = ['dd/mm/yyyy', 'Count', 'Score'];
    const reportData = evaluateData.map(({ _id: { day, month, year }, totalScore, count }) => {
      return {
        'dd/mm/yyyy': `${day}/${month}/${year}`,
        Count: count.toLocaleString('en'),
        Score: (totalScore / count).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' }),
      };
    });

    return {
      reportHeaders,
      reportData,
    };
  }

  async getReportQaPerformanceByAgent(evaluateFilter) {
    const evaluateData = await evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $group: {
          _id: '$qaAgentId',
          count: { $sum: 1 },
        },
      },
    ]);
    const userData = await userModel.find({ _id: { $in: evaluateData.map(({ _id: qaAgentId }) => qaAgentId) } }, 'username email').lean();
    const mapUserData = userData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());

    const reportHeaders = ['Username', 'QA Email', 'Actual'];
    const reportData = evaluateData
      .map(({ _id: qaAgentId, count }) => {
        const qaAgent = mapUserData.get(qaAgentId);
        if (qaAgent) return { Username: qaAgent.username || '-', 'QA Email': qaAgent.email, Actual: count };
        return { Username: '-', 'QA Email': 'not found', Actual: count };
      })
      .sort((a, b) => a['QA Email'].localeCompare(b['QA Email']));

    return {
      reportHeaders,
      reportData,
    };
  }
}

module.exports = ReportOfAgentAndTeamPerformanceRepository;
