require('dotenv').config();
const moment = require('moment-timezone');
const { templateQuestionModel } = require('../../models');
class TemplateQuestionRepositor {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getListByFilter(filter) {
    return templateQuestionModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getOneByFilter(filter) {
    return templateQuestionModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new templateQuestionModel(dataBody);
    return await schemData.save().then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async update(questionId, dataForUpdate) {
    return templateQuestionModel
      .findByIdAndUpdate(
        questionId,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        {
          upsert: true,
          new: true,
        },
      )
      .then((results) => {
        return JSON.parse(JSON.stringify(results));
      });
  }

  async delete(questionId) {
    return await templateQuestionModel.deleteOne({ _id: questionId }).then((results) => {
      return results;
    });
  }
}

module.exports = TemplateQuestionRepositor;
