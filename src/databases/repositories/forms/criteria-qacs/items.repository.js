require('dotenv').config();
const moment = require('moment-timezone');
const { criteriaQacsItemModel } = require('../../../models');

class CriteriaQaCsItemQuestionRepository {
  constructor() {}

  async getListByFilter(filter) {
    return criteriaQacsItemModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async getOneByFilter(filter) {
    return await criteriaQacsItemModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async create(formId, questionId, dataBody) {
    const dataForCreate = {
      formId: formId,
      questionId: questionId,
      ...dataBody,
    };
    const schemData = new criteriaQacsItemModel(dataForCreate);
    return await schemData.save();
  }

  async updateWithFilter(itemId, dataForUpdate) {
    return criteriaQacsItemModel
      .findByIdAndUpdate(
        itemId,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  async removeItem(formId, questionId, itemId) {
    const filter = {
      _id: itemId,
      formId: formId,
      questionId: questionId,
    };
    return await criteriaQacsItemModel.deleteOne(filter);
  }
}

module.exports = CriteriaQaCsItemQuestionRepository;
