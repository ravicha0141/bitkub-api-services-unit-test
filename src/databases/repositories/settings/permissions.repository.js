require('dotenv').config();
const moment = require('moment-timezone');
const { permissionModel } = require('../../models');
class PermissionRepositor {
  constructor() {}

  async getOneByFilter(filter) {
    return permissionModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getListByFilter(query) {
    return permissionModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async create(dataForCreate) {
    const schemaData = new permissionModel(dataForCreate);
    return schemaData.save();
  }

  async update(id, dataForUpdate) {
    return permissionModel
      .findByIdAndUpdate(
        id,
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

  async deleteOne(_id) {
    return permissionModel.findOneAndDelete({ _id });
  }
}
module.exports = PermissionRepositor;
