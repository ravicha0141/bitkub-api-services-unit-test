require('dotenv').config();
const moment = require('moment-timezone');
const badAnalysisFormModel = require('../../../models/forms/bad-analysis-form/bad-analysis-form.model');

class BadAnalysisFormRepository {
  constructor() {}

  async getListByFilter(filter) {
    return await badAnalysisFormModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return await badAnalysisFormModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new badAnalysisFormModel(dataBody);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(itemId, dataForUpdate) {
    return await badAnalysisFormModel
      .findByIdAndUpdate(
        itemId,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        {
          new: true,
        },
      )
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      });
  }

  async removeItem(formId) {
    const filter = { _id: formId };
    return await badAnalysisFormModel.deleteOne(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = BadAnalysisFormRepository;
