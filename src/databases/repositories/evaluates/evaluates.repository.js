require('dotenv').config();
const moment = require('moment-timezone');
const { evaluateModel } = require('../../models');
class EvaluateRepository {
  constructor() {}

  async getListByFilter(filter) {
    return evaluateModel.find(filter).lean();
  }

  async findOneByFilter(filter) {
    return evaluateModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataForCreate) {
    const schemData = new evaluateModel(dataForCreate);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(evaluateId, dataForUpdate) {
    return evaluateModel
      .findByIdAndUpdate(
        evaluateId,
        {
          ...dataForUpdate,
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

  async updateByFilter(filter, dataForUpdate) {
    return evaluateModel.updateOne(filter, dataForUpdate).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
  async deleteOne(evaluateId) {
    return evaluateModel.findOneAndDelete({
      _id: evaluateId,
    });
  }
}
module.exports = EvaluateRepository;
