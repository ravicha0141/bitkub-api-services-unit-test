const { Types } = require('mongoose');
const { groupModel, resultEvaluateOfQaCsModel, evaluateModel, resultEvaluateOfKycModel, criteriaKycFormModel } = require('../../models');
const SCORE_THRESHOLD = 85;
class ReportOfCompliantAndNoncompliantRepositor {
  constructor() {}

  async getReportCriteriaKycByWeek(evaluateFilter) {
    const evaluateQuery = evaluateModel.find(evaluateFilter, '_id groupId').lean();
    const countEvaluateByWeekQuery = evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          isPassed: {
            $cond: [{ $gte: ['$percentage', SCORE_THRESHOLD] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            dateUnit: { $week: '$modifiedDate' },
            groupId: '$groupId',
          },
          totalEval: {
            $sum: 1,
          },
          totalPassed: {
            $sum: '$isPassed',
          },
        },
      },
      {
        $sort: {
          '_id.groupId': 1,
          '_id.dateUnit': 1,
        },
      },
    ]);
    const questionQuery = criteriaKycFormModel.aggregate([
      { $match: { _id: Types.ObjectId(evaluateFilter.formId) } },
      { $unwind: '$listQuestions' },
      {
        $project: {
          _id: 0,
          questionTitle: {
            $concat: [{ $toString: '$listQuestions.order' }, '). ', '$listQuestions.title'],
          },
          questionDetail: {
            $cond: [
              { $and: [{ $ne: ['$listQuestions.detail', null] }, { $ne: ['$listQuestions.detail', ''] }] },
              { $concat: ['\n\n\t', '$listQuestions.detail'] },
              '',
            ],
          },
          questionId: '$listQuestions._id',
        },
      },
    ]);
    const [evaluateData, countEvaluate, questionData] = await Promise.all([evaluateQuery, countEvaluateByWeekQuery, questionQuery]);
    const groupNameQuery = groupModel.find({ _id: { $in: evaluateData.map(({ groupId }) => groupId) } }, 'name').lean();
    const mapQuestions = questionData.reduce(
      (acc, { questionId, questionTitle, questionDetail }) => acc.set(String(questionId), questionTitle + questionDetail),
      new Map(),
    );
    const resultQuery = resultEvaluateOfKycModel.aggregate([
      { $match: { evaluateId: { $in: evaluateData.map(({ _id }) => _id.toString()) } } },
      {
        $unwind: '$listQuestions',
      },
      {
        $project: {
          questionId: '$listQuestions.questionId',
          isNo: {
            $cond: [{ $eq: ['$listQuestions.result', 'no'] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            dateUnit: { $week: '$modifiedDate' },
            questionId: '$questionId',
          },
          countResultNo: {
            $sum: '$isNo',
          },
          countEvaluation: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.questionId': 1,
          '_id.dateUnit': 1,
        },
      },
    ]);
    const [resultData, groupNames] = await Promise.all([resultQuery, groupNameQuery]);
    if (resultData.length === 0) return { reportHeaders: [], reportData: [] };
    const mapGroupNames = groupNames.reduce((acc, { _id, name }) => acc.set(_id.toString(), name), new Map());

    // loop thought result data
    const mapReport = resultData.reduce((acc, { _id: { dateUnit, questionId }, countResultNo, countEvaluation }) => {
      const rowData = acc.get(questionId) || { Title: mapQuestions.get(questionId) || 'not found.' };
      const weekName = 'W'.concat(dateUnit + 1);
      rowData[weekName] = (countResultNo / countEvaluation).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
      return acc.set(questionId, rowData);
    }, new Map());

    let reportData = Array.from(mapReport.values());
    const reportHeaders = Object.keys(reportData[0]);
    const emptyColumn = reportHeaders.reduce((acc, cur) => {
      return { ...acc, [cur]: '' };
    }, {});

    reportData.push(emptyColumn);
    const columnPassNotPassHeader = reportHeaders.reduce((acc, cur) => {
      acc[cur] = cur;
      return acc;
    }, {});
    reportData.push(columnPassNotPassHeader);
    const passCountReport = countEvaluate.reduce(
      (acc, { _id: { dateUnit }, totalPassed, totalEval }) => {
        const weekName = 'W'.concat(dateUnit + 1);
        const passedPercent = totalPassed / totalEval;
        acc[0][weekName] = passedPercent.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        acc[1][weekName] = (1 - passedPercent).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc;
      },
      [{ Title: 'Passed' }, { Title: 'Not Passed' }],
    );
    reportData = reportData.concat(passCountReport);
    reportData.push(emptyColumn);
    const columnCountTicketHeader = reportHeaders.reduce((acc, cur) => {
      if (cur == 'Title') return { ...acc, Title: 'Team' };
      return { ...acc, [cur]: `Tickets Monitored(${cur})` };
    }, {});
    reportData.push(columnCountTicketHeader);
    const reportCountTicketMap = countEvaluate.reduce((acc, { _id: { dateUnit, groupId }, totalEval }) => {
      const groupName = mapGroupNames.get(groupId) || 'unknown';
      const rowData = acc.get(groupId) || { Title: groupName };
      rowData[`W${dateUnit + 1}`] = totalEval.toLocaleString('en');
      return acc.set(groupId, rowData);
    }, new Map());

    for (const value of reportCountTicketMap.values()) {
      reportData.push(value);
    }

    return {
      reportHeaders,
      reportData,
    };
  }

  async getReportCriteriaQaCsByWeek(evaluateFilter) {
    const evaluateQuery = evaluateModel.find(evaluateFilter, '_id groupId').lean();
    const countEvaluateQuery = evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          isPassed: {
            $cond: [{ $gte: ['$percentage', SCORE_THRESHOLD] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            dateUnit: { $week: '$modifiedDate' },
            groupId: '$groupId',
          },
          totalEval: {
            $sum: 1,
          },
          totalPassed: {
            $sum: '$isPassed',
          },
        },
      },
      {
        $sort: {
          '_id.groupId': 1,
          '_id.dateUnit': 1,
        },
      },
    ]);
    const [evaluateData, countEvaluate] = await Promise.all([evaluateQuery, countEvaluateQuery]);
    const groupNameQuery = groupModel.find({ _id: { $in: evaluateData.map(({ groupId }) => groupId) } }, 'name').lean();
    const resultQuery = resultEvaluateOfQaCsModel.aggregate([
      { $match: { evaluateId: { $in: evaluateData.map(({ _id }) => _id.toString()) } } },
      {
        $project: {
          referId: 1,
          questionTitle: {
            $concat: ['$referOrder', '). ', '$referTitle'],
          },
          questionDetail: {
            $cond: [
              { $and: [{ $ne: ['$referDetail', null] }, { $ne: ['$referDetail', ''] }] },
              { $concat: ['\n\n\t', '$referDetail'] },
              '',
            ],
          },
          isNo: {
            $cond: [{ $eq: [{ $arrayElemAt: ['$values.value', 2] }, 'no'] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            dateUnit: { $week: '$modifiedDate' },
            questionId: '$referId',
          },
          questionTitle: {
            $first: '$questionTitle',
          },
          questionDetail: {
            $first: '$questionDetail',
          },
          countResultNo: {
            $sum: '$isNo',
          },
          countEvaluation: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.questionId': 1,
          '_id.dateUnit': 1,
        },
      },
    ]);
    const [resultData, groupNames] = await Promise.all([resultQuery, groupNameQuery]);
    if (resultData.length === 0) return { reportHeaders: [], reportData: [] };
    const mapGroupNames = groupNames.reduce((acc, { _id, name }) => acc.set(_id.toString(), name), new Map());

    // loop thought result data
    const mapReport = resultData.reduce(
      (acc, { _id: { dateUnit, questionId }, countResultNo, countEvaluation, questionTitle, questionDetail }) => {
        const rowData = acc.get(questionId) || { Title: questionTitle + questionDetail };
        const questionScore = countResultNo / countEvaluation;
        const weekName = 'W'.concat(dateUnit + 1);
        rowData[weekName] = questionScore.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc.set(questionId, rowData);
      },
      new Map(),
    );

    let reportData = Array.from(mapReport.values());
    const reportHeaders = Object.keys(reportData[0]);
    const emptyColumn = reportHeaders.reduce((acc, cur) => {
      return { ...acc, [cur]: '' };
    }, {});

    reportData.push(emptyColumn);
    const columnPassNotPassHeader = reportHeaders.reduce((acc, cur) => {
      acc[cur] = cur;
      return acc;
    }, {});
    reportData.push(columnPassNotPassHeader);
    const passCountReport = countEvaluate.reduce(
      (acc, { _id: { dateUnit }, totalPassed, totalEval }) => {
        const weekName = 'W'.concat(dateUnit + 1);
        const passedPercent = totalPassed / totalEval;
        acc[0][weekName] = passedPercent.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        acc[1][weekName] = (1 - passedPercent).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc;
      },
      [{ Title: 'Passed' }, { Title: 'Not Passed' }],
    );

    reportData = reportData.concat(passCountReport);
    reportData.push(emptyColumn);
    const columnCountTicketHeader = reportHeaders.reduce((acc, cur) => {
      if (cur == 'Title') return { ...acc, Title: 'Team' };
      return { ...acc, [cur]: `Tickets Monitored(${cur})` };
    }, {});
    reportData.push(columnCountTicketHeader);
    const reportCountTicketMap = countEvaluate.reduce((acc, { _id: { dateUnit, groupId }, totalEval }) => {
      const groupName = mapGroupNames.get(groupId) || 'unknown';
      const rowData = acc.get(groupId) || { Title: groupName };
      rowData[`W${dateUnit + 1}`] = totalEval.toLocaleString('en');
      return acc.set(groupId, rowData);
    }, new Map());
    for (const value of reportCountTicketMap.values()) {
      reportData.push(value);
    }
    return {
      reportHeaders,
      reportData,
    };
  }

  async getReportCriteriaKycByDate(evaluateFilter) {
    const evaluateQuery = evaluateModel.find(evaluateFilter, '_id groupId').lean();
    const countEvaluateQuery = evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          isPassed: {
            $cond: [{ $gte: ['$percentage', SCORE_THRESHOLD] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$modifiedDate' },
            month: { $month: '$modifiedDate' },
            day: { $dayOfMonth: '$modifiedDate' },
            groupId: '$groupId',
          },
          totalEval: {
            $sum: 1,
          },
          totalPassed: {
            $sum: '$isPassed',
          },
        },
      },
      {
        $sort: {
          '_id.groupId': 1,
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    const questionQuery = criteriaKycFormModel.aggregate([
      { $match: { _id: Types.ObjectId(evaluateFilter.formId) } },
      { $unwind: '$listQuestions' },
      {
        $project: {
          _id: 0,
          questionTitle: {
            $concat: [{ $toString: '$listQuestions.order' }, '). ', '$listQuestions.title'],
          },
          questionDetail: {
            $cond: [
              { $and: [{ $ne: ['$listQuestions.detail', null] }, { $ne: ['$listQuestions.detail', ''] }] },
              { $concat: ['\n\n\t', '$listQuestions.detail'] },
              '',
            ],
          },
          questionId: '$listQuestions._id',
        },
      },
    ]);
    const [evaluateData, countEvaluate, questionData] = await Promise.all([evaluateQuery, countEvaluateQuery, questionQuery]);
    const groupNameQuery = groupModel.find({ _id: { $in: evaluateData.map(({ groupId }) => groupId) } }, 'name').lean();
    const mapQuestions = questionData.reduce(
      (acc, { questionId, questionTitle, questionDetail }) => acc.set(String(questionId), questionTitle + questionDetail),
      new Map(),
    );
    const resultQuery = resultEvaluateOfKycModel.aggregate([
      { $match: { evaluateId: { $in: evaluateData.map(({ _id }) => _id.toString()) } } },
      {
        $unwind: '$listQuestions',
      },
      {
        $project: {
          questionId: '$listQuestions.questionId',
          isNo: {
            $cond: [{ $eq: ['$listQuestions.result', 'no'] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$modifiedDate' },
            month: { $month: '$modifiedDate' },
            day: { $dayOfMonth: '$modifiedDate' },
            questionId: '$questionId',
          },
          countResultNo: {
            $sum: '$isNo',
          },
          countEvaluation: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.questionId': 1,
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    const [resultData, groupNames] = await Promise.all([resultQuery, groupNameQuery]);
    if (resultData.length === 0) return { reportHeaders: [], reportData: [] };
    const mapGroupNames = groupNames.reduce((acc, { _id, name }) => acc.set(_id.toString(), name), new Map());

    // loop thought result data
    const mapReport = resultData.reduce((acc, { _id: { year, month, day, questionId }, countResultNo, countEvaluation }) => {
      const rowData = acc.get(questionId) || { Title: mapQuestions.get(questionId) || 'not found.' };
      const dateName = `${day}/${month}/${year}`;
      rowData[dateName] = (countResultNo / countEvaluation).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
      return acc.set(questionId, rowData);
    }, new Map());

    let reportData = Array.from(mapReport.values());
    const reportHeaders = Object.keys(reportData[0]);
    const emptyColumn = reportHeaders.reduce((acc, cur) => {
      return { ...acc, [cur]: '' };
    }, {});

    reportData.push(emptyColumn);
    const columnPassNotPassHeader = reportHeaders.reduce((acc, cur) => {
      acc[cur] = cur;
      return acc;
    }, {});
    reportData.push(columnPassNotPassHeader);
    const passCountReport = countEvaluate.reduce(
      (acc, { _id: { year, month, day }, totalPassed, totalEval }) => {
        const dateName = `${day}/${month}/${year}`;
        const passedPercent = totalPassed / totalEval;
        acc[0][dateName] = passedPercent.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        acc[1][dateName] = (1 - passedPercent).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc;
      },
      [{ Title: 'Passed' }, { Title: 'Not Passed' }],
    );
    reportData = reportData.concat(passCountReport);
    reportData.push(emptyColumn);
    const columnCountTicketHeader = reportHeaders.reduce((acc, cur) => {
      if (cur == 'Title') return { ...acc, Title: 'Team' };
      return { ...acc, [cur]: `Tickets Monitored(${cur})` };
    }, {});
    reportData.push(columnCountTicketHeader);
    const reportCountTicketMap = countEvaluate.reduce((acc, { _id: { year, month, day, groupId }, totalEval }) => {
      const groupName = mapGroupNames.get(groupId) || 'unknown';
      const rowData = acc.get(groupId) || { Team: groupName };
      rowData[`${day}/${month}/${year}`] = totalEval.toLocaleString('en');
      return acc.set(groupId, rowData);
    }, new Map());
    for (const value of reportCountTicketMap.values()) {
      reportData.push(value);
    }
    return {
      reportHeaders,
      reportData,
    };
  }

  async getReportCriteriaQaCsByDate(evaluateFilter) {
    const evaluateQuery = evaluateModel.find(evaluateFilter, '_id groupId').lean();
    const countEvaluateQuery = evaluateModel.aggregate([
      { $match: evaluateFilter },
      {
        $addFields: {
          isPassed: {
            $cond: [{ $gte: ['$percentage', SCORE_THRESHOLD] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$modifiedDate' },
            month: { $month: '$modifiedDate' },
            day: { $dayOfMonth: '$modifiedDate' },
            groupId: '$groupId',
          },
          totalEval: {
            $sum: 1,
          },
          totalPassed: {
            $sum: '$isPassed',
          },
        },
      },
      {
        $sort: {
          '_id.groupId': 1,
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    const [evaluateData, countEvaluate] = await Promise.all([evaluateQuery, countEvaluateQuery]);
    const groupNameQuery = groupModel.find({ _id: { $in: evaluateData.map(({ groupId }) => groupId) } }, 'name').lean();
    const resultQuery = resultEvaluateOfQaCsModel.aggregate([
      { $match: { evaluateId: { $in: evaluateData.map(({ _id }) => _id.toString()) } } },
      {
        $project: {
          referId: 1,
          questionTitle: {
            $concat: ['$referOrder', '). ', '$referTitle'],
          },
          questionDetail: {
            $cond: [
              { $and: [{ $ne: ['$referDetail', null] }, { $ne: ['$referDetail', ''] }] },
              { $concat: ['\n\n\t', '$referDetail'] },
              '',
            ],
          },
          isNo: {
            $cond: [{ $eq: [{ $arrayElemAt: ['$values.value', 2] }, 'no'] }, 1, 0],
          },
          modifiedDate: {
            $add: ['$completedDate', { $multiply: [1000, 60, 60, 7] }],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$modifiedDate' },
            month: { $month: '$modifiedDate' },
            day: { $dayOfMonth: '$modifiedDate' },
            questionId: '$referId',
          },
          questionTitle: {
            $first: '$questionTitle',
          },
          questionDetail: {
            $first: '$questionDetail',
          },
          countResultNo: {
            $sum: '$isNo',
          },
          countEvaluation: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.questionId': 1,
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);

    const [resultData, groupNames] = await Promise.all([resultQuery, groupNameQuery]);
    if (resultData.length === 0) return { reportHeaders: [], reportData: [] };
    const mapGroupNames = groupNames.reduce((acc, { _id, name }) => acc.set(_id.toString(), name), new Map());

    // loop thought result data
    const mapReport = resultData.reduce(
      (acc, { _id: { year, month, day, questionId }, countResultNo, countEvaluation, questionTitle, questionDetail }) => {
        const rowData = acc.get(questionId) || { Title: questionTitle + questionDetail };
        const questionScore = countResultNo / countEvaluation;
        const dateName = `${day}/${month}/${year}`;
        rowData[dateName] = questionScore.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc.set(questionId, rowData);
      },
      new Map(),
    );

    let reportData = Array.from(mapReport.values());
    const reportHeaders = Object.keys(reportData[0]);
    const emptyColumn = reportHeaders.reduce((acc, cur) => {
      return { ...acc, [cur]: '' };
    }, {});

    reportData.push(emptyColumn);
    const columnPassNotPassHeader = reportHeaders.reduce((acc, cur) => {
      acc[cur] = cur;
      return acc;
    }, {});
    reportData.push(columnPassNotPassHeader);
    const passCountReport = countEvaluate.reduce(
      (acc, { _id: { year, month, day }, totalPassed, totalEval }) => {
        const dateName = `${day}/${month}/${year}`;
        const passedPercent = totalPassed / totalEval;
        acc[0][dateName] = passedPercent.toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        acc[1][dateName] = (1 - passedPercent).toLocaleString('en', { maximumFractionDigits: 2, style: 'percent' });
        return acc;
      },
      [{ Title: 'Passed' }, { Title: 'Not Passed' }],
    );
    reportData = reportData.concat(passCountReport);
    reportData.push(emptyColumn);
    const columnCountTicketHeader = reportHeaders.reduce((acc, cur) => {
      if (cur == 'Title') return { ...acc, Title: 'Team' };
      return { ...acc, [cur]: `Tickets Monitored(${cur})` };
    }, {});
    reportData.push(columnCountTicketHeader);
    const reportCountTicketMap = countEvaluate.reduce((acc, { _id: { year, month, day, groupId }, totalEval }) => {
      const groupName = mapGroupNames.get(groupId) || 'unknown';
      const rowData = acc.get(groupId) || { Title: groupName };
      rowData[`${day}/${month}/${year}`] = totalEval.toLocaleString('en');
      return acc.set(groupId, rowData);
    }, new Map());

    for (const value of reportCountTicketMap.values()) {
      reportData.push(value);
    }

    return {
      reportHeaders,
      reportData,
    };
  }
}

module.exports = ReportOfCompliantAndNoncompliantRepositor;
