require('dotenv').config();
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const { isValidObjectId } = require('mongoose');
const { resultEvaluateOfQaCsModel } = require('../../models');
const evaluateDto = require(path.resolve(`${__dir}/src/dto/evaluate.dto`));
class ResultEvaluateOfQaCsService {
  constructor() {}

  async getListByFilter(filter) {
    return resultEvaluateOfQaCsModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async findOneByFilter(filter) {
    return resultEvaluateOfQaCsModel
      .findOne(filter)
      .then((doc) => {
        return JSON.parse(JSON.stringify(doc));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const createEvaluateDTO = await evaluateDto.createResultEvaluateDTO(dataBody);
    const schemData = new resultEvaluateOfQaCsModel(createEvaluateDTO);
    return await schemData.save();
  }

  async update(resultId, dataBody) {
    const currentDate = moment().tz('Asia/Bangkok');
    return resultEvaluateOfQaCsModel
      .findByIdAndUpdate(
        resultId,
        {
          ...dataBody,
          completedDate: currentDate.toDate(),
          updatedAt: currentDate.unix(),
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async deleteOne(resultId) {
    if (!isValidObjectId(resultId)) return null;
    return resultEvaluateOfQaCsModel.findOneAndDelete({
      _id: resultId,
    });
  }

  async deleteMany(evaluateId) {
    try {
      const deleteOne = await resultEvaluateOfQaCsModel.deleteMany({ evaluateId });
      if (deleteOne['deletedCount'] > 0) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ResultEvaluateOfQaCsService;
