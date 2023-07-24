require('dotenv').config();
const moment = require('moment-timezone');
const { dashboardModel } = require('../models');

class DashboardRepository {
  constructor() {}

  async getAll(query) {
    return dashboardModel
      .find(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneByFilter(query) {
    return dashboardModel
      .findOne(query)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(bodyData) {
    const schem = new dashboardModel(bodyData);
    return await schem.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async deleteOne(id) {
    return dashboardModel.findOneAndDelete({ _id: id });
  }

  async findByIdAndUpdateById(dashboardId, dataForUpdate) {
    return dashboardModel
      .findByIdAndUpdate(
        dashboardId,
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
}

module.exports = DashboardRepository;
