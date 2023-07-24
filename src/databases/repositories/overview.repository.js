require('dotenv').config();
const moment = require('moment-timezone');
const { overviewModel } = require('../models');
class OverviewRepository {
  constructor() {}

  async getOverviewData() {
    return await overviewModel
      .findOne({ title: 'Overview' })
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async update(overviewId, dataForUpdate) {
    return await overviewModel
      .findByIdAndUpdate(
        overviewId,
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
}

module.exports = OverviewRepository;
