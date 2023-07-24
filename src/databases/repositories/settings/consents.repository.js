require('dotenv').config();
const moment = require('moment-timezone');
const { consentModel } = require('../../models');
class ConsentRepositor {
  constructor() {}

  async getOneByFilter(filter) {
    return consentModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getListByFilter(query) {
    return consentModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async create(dataForCreate) {
    const schemaData = new consentModel(dataForCreate);
    return schemaData.save();
  }

  async update(id, dataForUpdate) {
    return consentModel
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
    return consentModel.findOneAndDelete({ _id });
  }
}
module.exports = ConsentRepositor;
