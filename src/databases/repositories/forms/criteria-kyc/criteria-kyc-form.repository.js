require('dotenv').config();
const moment = require('moment-timezone');
const criteriaKycModel = require('../../../models/forms/criteria-kyc-form/criteria-kyc.model');

class CriteriaKycFormRepository {
  constructor() {}

  async getListByFilter(filter) {
    return await criteriaKycModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(filter) {
    return await criteriaKycModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new criteriaKycModel(dataBody);
    return await schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(uuid, dataForUpdate) {
    return await criteriaKycModel
      .findByIdAndUpdate(
        uuid,
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

  async removeItem(uuid) {
    const filter = { _id: uuid };
    return await criteriaKycModel.deleteOne(filter).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = CriteriaKycFormRepository;
