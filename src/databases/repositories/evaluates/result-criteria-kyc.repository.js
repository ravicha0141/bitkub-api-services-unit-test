const moment = require('moment-timezone');
const { resultEvaluateOfKycModel } = require('../../models');
require('dotenv').config();

class ResultOfCriteriaKycService {
  constructor() {}

  async getListByFilter(filter) {
    return await resultEvaluateOfKycModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return await resultEvaluateOfKycModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new resultEvaluateOfKycModel(dataBody);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(uuid, dataForUpdate) {
    return await resultEvaluateOfKycModel
      .findByIdAndUpdate(
        uuid,
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

  async removeItem(uuid) {
    const filter = { _id: uuid };
    return await resultEvaluateOfKycModel.deleteOne(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async removeItemMany(evaluateId) {
    const filter = { evaluateId };
    return await resultEvaluateOfKycModel.deleteMany(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = ResultOfCriteriaKycService;
