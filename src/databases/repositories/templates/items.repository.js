require('dotenv').config();
const moment = require('moment-timezone');
const { itemOfTemplateModel } = require('../../models');
class TemplateItemRepositor {
  constructor() {}

  async getListByFilter(filter) {
    return itemOfTemplateModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return itemOfTemplateModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new itemOfTemplateModel(dataBody);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(itemId, dataForUpdate) {
    return itemOfTemplateModel
      .findByIdAndUpdate(
        itemId,
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

  async removeItem(templateId, questionId, itemId) {
    const filter = { _id: itemId, templateId, questionId };
    return itemOfTemplateModel.deleteOne(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = TemplateItemRepositor;
