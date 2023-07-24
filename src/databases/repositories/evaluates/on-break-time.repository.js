require('dotenv').config();
const moment = require('moment-timezone');
const { onBreakTimeModel } = require('../../models/evaluates/on-break-times.model');

class OnBreakTimeRepository {
  constructor() {
    this.onBreakTime = onBreakTimeModel;
  }

  async getListByFilter(filter) {
    return this.onBreakTime.find(filter).lean();
  }

  async getOneByFilter(filter) {
    return this.onBreakTime
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataForCreate) {
    const schemData = new this.onBreakTime(dataForCreate);
    return schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(id, dataForUpdate) {
    return this.onBreakTime
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
    return this.onBreakTime.findOneAndDelete({ _id });
  }
}

module.exports = OnBreakTimeRepository;
