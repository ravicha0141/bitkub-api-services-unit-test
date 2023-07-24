require('dotenv').config();
const moment = require('moment-timezone');
const { resultEvaluateOfBadAnalysis } = require('../../models');

class ResultOfBadAnalysisServices {
  constructor() {}

  async getListByFilter(filter) {
    return resultEvaluateOfBadAnalysis
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return resultEvaluateOfBadAnalysis
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new resultEvaluateOfBadAnalysis(dataBody);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(itemId, dataForUpdate) {
    return resultEvaluateOfBadAnalysis
      .findByIdAndUpdate(
        itemId,
        {
          ...dataForUpdate,
          completedDate: moment().tz('Asia/Bangkok').toDate(),
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        {
          upsert: true,
          new: true,
        },
      )
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      });
  }

  async removeItem(templateId, formId) {
    const filter = { _id: formId, templateId };
    return resultEvaluateOfBadAnalysis.deleteOne(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async removeItemMany(evaluateId) {
    const filter = { evaluateId };
    return resultEvaluateOfBadAnalysis.deleteMany(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = ResultOfBadAnalysisServices;
