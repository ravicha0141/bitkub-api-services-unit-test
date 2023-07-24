const moment = require('moment-timezone');
const { criteriaQaCsFormModel } = require('../../../models');
class CriteriaQaCsRepository {
  constructor() {}

  async getListByFilter(filter) {
    return criteriaQaCsFormModel.find(filter).lean();
  }

  async getOneFormWithFilter(filter) {
    return criteriaQaCsFormModel.findOne(filter).lean();
  }

  async getOneByFilter(filter) {
    return criteriaQaCsFormModel.findOne(filter).lean();
  }

  async createForm(dataBody) {
    const schemData = new criteriaQaCsFormModel(dataBody);
    return schemData.save().then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async updateFormByIdWithObject(formId, dataForUpdate) {
    return criteriaQaCsFormModel
      .findByIdAndUpdate(
        formId,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        { new: true },
      )
      .then((doc) => {
        return JSON.parse(JSON.stringify(doc));
      });
  }

  async deleteForm(formId) {
    return criteriaQaCsFormModel.deleteOne({ _id: formId }).then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }
}

module.exports = CriteriaQaCsRepository;
