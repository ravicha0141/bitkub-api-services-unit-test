const {
  Types: { ObjectId },
} = require('mongoose');
const badAnalysisFormModel = require('../../models/forms/bad-analysis-form/bad-analysis-form.model');
const resultOfBadAnalysisModel = require('../../models/evaluates/result-of-bad-analysis.model');
const moment = require('moment-timezone');
class ReportOfBadAnalysisRepository {
  constructor() {}

  async getReportTotalBad(frequency, filter) {
    const choiceList = await badAnalysisFormModel.aggregate([
      { $match: { _id: ObjectId(filter.badAnalysisId) } },
      { $unwind: '$reasonForBad' },
      {
        $sort: {
          'reasonForBad.order': 1,
        },
      },
      {
        $project: {
          _id: false,
          choiceId: '$reasonForBad._id',
          choiceName: '$reasonForBad.choiceName',
        },
      },
    ]);
    const reportHeaders = choiceList.reduce((acc, cur) => {
      acc.push(cur.choiceName.concat(' (count)'), cur.choiceName.concat(' (percent)'));
      return acc;
    }, []);
    let groupBy = { $year: '$completedDate' };
    if (frequency === 'ALL_WK') {
      groupBy = { $week: '$completedDate' };
    } else if (frequency === 'ALL_MM') {
      groupBy = { $month: '$completedDate' };
    }
    const resultBadAnalysisData = await resultOfBadAnalysisModel.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            dateUnit: groupBy,
            choiceId: '$reasonForBad.referId',
          },
          choiceOrder: {
            $first: '$reasonForBad.order',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.dateUnit': 1,
          choiceOrder: 1,
        },
      },
      {
        $group: {
          _id: '$_id.dateUnit',
          choices: {
            $push: {
              id: '$_id.choiceId',
              count: '$count',
            },
          },
          countTotal: {
            $sum: '$count',
          },
        },
      },
    ]);
    const reportData = resultBadAnalysisData.map(({ _id: dateUnit, choices, countTotal }) => {
      const prefixName = frequency === 'ALL_WK' ? 'W' : frequency === 'ALL_MM' ? 'M' : '';
      const rowData = { title: prefixName.concat(frequency === 'ALL_WK' ? dateUnit + 1 : dateUnit), total: String(countTotal) };

      const choiceMap = choices.reduce((acc, cur) => acc.set(String(cur.id), cur.count), new Map());

      choiceList.every(({ choiceId, choiceName }) => {
        const choiceCount = choiceMap.get(String(choiceId)) || 0;
        const choicePercent = countTotal > 0 ? choiceCount / countTotal : 0;
        rowData[choiceName.concat(' (count)')] = String(choiceCount);
        rowData[choiceName.concat(' (percent)')] = choicePercent.toLocaleString('en', { style: 'percent', maximumFractionDigits: 2 });
        return true;
      });
      return rowData;
    });
    return { reportHeaders, reportData: reportData.sort((a, b) => a.title.localeCompare(b.title)) };
  }

  async getReportTeamBad(filter) {
    const choiceList = await badAnalysisFormModel.aggregate([
      { $match: { _id: ObjectId(filter.badAnalysisId) } },
      { $unwind: '$reasonForBad' },
      {
        $sort: {
          'reasonForBad.order': 1,
        },
      },
      {
        $project: {
          _id: false,
          choiceId: '$reasonForBad._id',
          choiceName: '$reasonForBad.choiceName',
        },
      },
    ]);

    const reportHeaders = choiceList.reduce((acc, cur) => {
      acc.push(cur.choiceName.concat(' (count)'), cur.choiceName.concat(' (percent)'));
      return acc;
    }, []);

    const resultBadAnalysisData = await resultOfBadAnalysisModel.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            groupId: '$groupId',
            choiceId: '$reasonForBad.referId',
          },
          groupName: {
            $first: '$groupName',
          },
          choiceOrder: {
            $first: '$reasonForBad.order',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          groupName: 1,
          choiceOrder: 1,
        },
      },
      {
        $group: {
          _id: '$_id.groupId',
          groupName: {
            $first: '$groupName',
          },
          choices: {
            $push: {
              id: '$_id.choiceId',
              count: '$count',
            },
          },
          countTotal: {
            $sum: '$count',
          },
        },
      },
    ]);

    let sumCountTotal = 0;
    const reportData = resultBadAnalysisData
      .map(({ _id: groupId, groupName, choices, countTotal }) => {
        sumCountTotal += countTotal;
        const rowData = { groupId, groupName, total: String(countTotal) };

        const choiceMap = choices.reduce((acc, cur) => acc.set(String(cur.id), cur.count), new Map());
        choiceList.every(({ choiceId, choiceName }) => {
          const choiceCount = choiceMap.get(String(choiceId)) || 0;
          const choicePercent = countTotal > 0 ? choiceCount / countTotal : 0;
          rowData[choiceName.concat(' (count)')] = String(choiceCount);
          rowData[choiceName.concat(' (percent)')] = choicePercent.toLocaleString('en', { style: 'percent', maximumFractionDigits: 2 });
          return true;
        });
        return rowData;
      })
      .sort((a, b) => a.groupName.localeCompare(b.groupName));
    reportData.push({ groupId: '0000', groupName: 'Total', total: String(sumCountTotal) });

    return { reportHeaders, reportData };
  }

  async getReportAgentBad(frequency, filter) {
    const choiceList = await badAnalysisFormModel.aggregate([
      { $match: { _id: ObjectId(filter.badAnalysisId) } },
      { $unwind: '$reasonForBad' },
      {
        $sort: {
          'reasonForBad.order': 1,
        },
      },
      { $unwind: '$reasonForBad.issues' },
      { $match: { 'reasonForBad._id': ObjectId(filter['reasonForBad.referId']) } },
      {
        $project: {
          _id: false,
          choiceId: '$reasonForBad.issues._id',
          choiceName: '$reasonForBad.issues.value',
        },
      },
    ]);

    const totalRow = choiceList.reduce(
      (acc, cur) => {
        acc[cur.choiceName] = 0;
        return acc;
      },
      { title: 'TOTAL', total: 0 },
    );
    const reportHeaders = choiceList.map(({ choiceName }) => choiceName);

    let groupBy = { $year: '$completedDate' };
    if (frequency === 'ALL_WK') {
      groupBy = { $week: '$completedDate' };
    } else if (frequency === 'ALL_MM') {
      groupBy = { $month: '$completedDate' };
    }
    const resultBadAnalysisData = await resultOfBadAnalysisModel.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            unitDate: groupBy,
            choiceId: '$reasonForBad.issues.referId',
          },
          choiceOrder: {
            $first: '$reasonForBad.issues.order',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          '_id.unitDate': 1,
          choiceOrder: 1,
        },
      },
      {
        $group: {
          _id: '$_id.unitDate',
          choices: {
            $push: {
              id: '$_id.choiceId',
              count: '$count',
            },
          },
          countTotal: {
            $sum: '$count',
          },
        },
      },
    ]);
    const monthNameList = moment.monthsShort();

    const reportData = resultBadAnalysisData
      .sort(({ _id: dateUnitA }, { _id: dateUnitB }) => dateUnitA - dateUnitB)
      .map(({ _id: dateUnit, choices, countTotal }) => {
        const rowData = { title: '', total: String(countTotal) };
        if (frequency === 'ALL_WK') {
          rowData.title = 'W'.concat(dateUnit + 1);
        } else if (frequency === 'ALL_MM') {
          rowData.title = monthNameList[dateUnit - 1];
        } else {
          rowData.title = String(dateUnit);
        }

        const choiceMap = choices.reduce((acc, cur) => acc.set(String(cur.id), cur.count), new Map());
        totalRow['total'] += countTotal;

        choiceList.every(({ choiceId, choiceName }) => {
          const choiceCount = choiceMap.get(String(choiceId)) || 0;
          // const choicePercent = countTotal > 0 ? (choiceCount / countTotal) * 100 : 0;
          rowData[choiceName] = String(choiceCount);
          totalRow[choiceName] += choiceCount;
          return true;
        });
        return rowData;
      });
    const percentRow = choiceList.reduce(
      (acc, cur) => {
        const percentData = totalRow['total'] === 0 ? 0 : totalRow[cur.choiceName] / totalRow['total'];
        acc[cur.choiceName] = percentData.toLocaleString('en', { style: 'percent', maximumFractionDigits: 2 });
        totalRow[cur.choiceName] = String(totalRow[cur.choiceName]);
        return acc;
      },
      { title: '', total: '100%' },
    );
    totalRow.total = String(totalRow.total);
    reportData.push(totalRow, percentRow);
    return { reportHeaders, reportData };
  }
}

module.exports = ReportOfBadAnalysisRepository;
