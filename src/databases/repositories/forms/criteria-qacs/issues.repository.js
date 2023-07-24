require('dotenv').config();
const moment = require('moment-timezone');
const { qacsIssueModel } = require('../../../models');
class CriteriaQaCsIssueRepository {
  constructor() {}

  async getListByFilter(filter) {
    return qacsIssueModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async getOneByFilter(filter) {
    return qacsIssueModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async create(formId, choiceId, dataBody) {
    const dataForCreate = {
      formId,
      choiceId,
      ...dataBody,
    };
    const schemData = new qacsIssueModel(dataForCreate);
    return await schemData.save();
  }

  async updateWithFilter(id, dataForUpdate) {
    return qacsIssueModel
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
    return qacsIssueModel.deleteOne({ _id });
  }
}

module.exports = CriteriaQaCsIssueRepository;
