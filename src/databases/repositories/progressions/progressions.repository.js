require('dotenv').config();
const moment = require('moment-timezone');
const { progressionModel } = require('../../models');

class ProgressionRepository {
  constructor() {}

  async getAll(query) {
    return progressionModel.find(query).lean();
  }

  async getListByFilter(query) {
    return progressionModel.find(query).lean();
  }

  async getOneByFilter(query) {
    return progressionModel.findOne(query).lean();
  }

  async create(bodyData) {
    const tempSchem = new progressionModel(bodyData);
    return await tempSchem.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async update(progressId, dataForUpdate) {
    return progressionModel
      .findByIdAndUpdate(
        progressId,
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

  async updateManyWithFilter(filter, dataForUpdate) {
    return progressionModel.updateMany(filter, dataForUpdate, { upsert: true, new: true });
  }

  async deleteOne(filter) {
    return progressionModel.findOneAndDelete(filter);
  }

  async deleteMany(filter) {
    return progressionModel.deleteMany(filter).then(({ deletedCount }) => {
      return deletedCount;
    });
  }
}

module.exports = ProgressionRepository;
