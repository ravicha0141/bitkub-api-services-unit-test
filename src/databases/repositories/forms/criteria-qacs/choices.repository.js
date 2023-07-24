require('dotenv').config();
const moment = require('moment-timezone');
const { qacsChoiceModel } = require('../../../models');
class CriteriaQaCsChoiceRepository {
  constructor() {}

  async getListByFilter(filter) {
    return qacsChoiceModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async getOneByFilter(filter) {
    return qacsChoiceModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async create(formId, dataBody) {
    const dataForCreate = {
      formId,
      ...dataBody,
    };
    const schemData = new qacsChoiceModel(dataForCreate);
    return await schemData.save();
  }

  async updateWithFilter(id, dataForUpdate) {
    return qacsChoiceModel
      .findByIdAndUpdate(
        id,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        { upsert: true },
      )
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async removeItem(_id) {
    return qacsChoiceModel.deleteOne({ _id });
  }
}

module.exports = CriteriaQaCsChoiceRepository;
