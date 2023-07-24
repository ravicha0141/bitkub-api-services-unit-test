require('dotenv').config();
const moment = require('moment-timezone');
const { templateModel } = require('../../models');
class TemplateRepositor {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getListByFilter(filter) {
    return templateModel
      .find(filter)
      .then((results) => {
        return JSON.parse(JSON.stringify(results));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return templateModel
      .findOne(filter)
      .then((data) => {
        return JSON.parse(JSON.stringify(data));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new templateModel(dataBody);
    return await schemData.save().then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async update(templateId, dataForUpdate) {
    return templateModel
      .findByIdAndUpdate(
        templateId,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        { new: true },
      )
      .then((data) => {
        return JSON.parse(JSON.stringify(data));
      });
  }
}

module.exports = TemplateRepositor;
