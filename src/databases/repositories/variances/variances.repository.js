require('dotenv').config();
const moment = require('moment-timezone');
const { VarianceStatusEnum } = require('../../../constants/variances.constants');
const { varianceModel } = require('../../models');

class VarianceRepositor {
  constructor() {}

  async getListByFilter(filter) {
    return varianceModel
      .find(filter)
      .lean()
      .then((result) => {
        return result.map((item) => {
          if (item.completedDate) item.completedDate = moment(item.completedDate).unix();
          return item;
        });
      });
  }

  async findOneByFilter(filter) {
    return varianceModel.findOne(filter).lean();
  }

  async create(dataForCreate) {
    const schemData = new varianceModel(dataForCreate);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(evaluateId, dataForUpdate) {
    if (dataForUpdate.status === VarianceStatusEnum.COMPLETED) dataForUpdate.completedDate = moment().tz('Asia/Bangkok').toDate();
    return varianceModel
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

  async deleteOne(_id) {
    return varianceModel.findOneAndDelete({ _id });
  }
}
module.exports = VarianceRepositor;
