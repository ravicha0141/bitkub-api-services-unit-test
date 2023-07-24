require('dotenv').config();
const moment = require('moment-timezone');
const { isValidObjectId } = require('mongoose');
const { auditlogModel } = require('../models');

class AuditlogRepository {
  constructor() {}

  async getAll(query) {
    return await auditlogModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return 0;
      });
  }

  async getOneByFilter(query) {
    return await auditlogModel
      .findOne(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getListByFilter(query) {
    return await auditlogModel.find(query).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async create(bodyData) {
    const schem = new auditlogModel(bodyData);
    return await schem.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async findByIdAndUpdateById(_id, dataForUpdate) {
    return auditlogModel
      .findByIdAndUpdate(
        _id,
        {
          ...dataForUpdate,
          updatedAt: moment().tz('Asia/Bangkok').unix(),
        },
        { upsert: true, new: true },
      )
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      });
  }

  async deleteOne(_id) {
    if (!isValidObjectId(_id)) return null;
    return auditlogModel.findOneAndDelete({ _id });
  }
}

module.exports = AuditlogRepository;
