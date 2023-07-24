require('dotenv').config();
const moment = require('moment-timezone');
const { accessManagementModel } = require('../../models');
class AccessManagementRepositor {
  constructor() {}

  async getOneByFilter(filter) {
    return accessManagementModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getListByFilter(query) {
    return accessManagementModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataForCreate) {
    const schemaData = new accessManagementModel(dataForCreate);
    return schemaData.save();
  }

  async createMany(dataList) {
    return accessManagementModel.insertMany(dataList);
  }

  async update(id, dataForUpdate) {
    return accessManagementModel
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
    return accessManagementModel.findOneAndDelete({ _id });
  }
}
module.exports = AccessManagementRepositor;
