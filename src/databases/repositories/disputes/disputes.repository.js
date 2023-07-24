require('dotenv').config();
const moment = require('moment-timezone');
const { disputeModel } = require('../../models');

class DisputeRepository {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getListOfDisputesByFilter(filter) {
    return disputeModel.find(filter).lean();
  }

  async getOneDisputeWithFilter(filter) {
    return disputeModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new disputeModel(dataBody);
    return schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async updateWithObject(disputeId, dataForUpdate) {
    return disputeModel
      .findByIdAndUpdate(
        disputeId,
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

  async deleteDisputeOne(disputeId) {
    return disputeModel.deleteOne({ _id: disputeId }).then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}

module.exports = DisputeRepository;
