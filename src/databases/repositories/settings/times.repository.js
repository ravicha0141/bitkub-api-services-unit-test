require('dotenv').config();
const moment = require('moment-timezone');
const { timeSettingModel } = require('../../models');
class TimeSettingRepositor {
  constructor() {}

  async getOneByFilter(filter) {
    return timeSettingModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getListByFilter(query) {
    return timeSettingModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataForCreate) {
    const schemaData = new timeSettingModel(dataForCreate);
    return schemaData.save();
  }

  async update(id, dataForUpdate) {
    return timeSettingModel
      .findByIdAndUpdate(
        id,
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
    return timeSettingModel.findOneAndDelete({ _id });
  }
}
module.exports = TimeSettingRepositor;
