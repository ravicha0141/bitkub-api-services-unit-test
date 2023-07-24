require('dotenv').config();
const moment = require('moment-timezone');
const { assignmentModel } = require('../../models');
const { updateSeqAssignment } = require('../../../utilities/conters-seq.util');
class AssignmentRepository {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getListByFilter(filter) {
    return assignmentModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return [];
      });
  }

  async getOneWithFilter(filter) {
    return assignmentModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async create(dataBody) {
    const schemData = new assignmentModel(dataBody);
    return await schemData.save().then((assignmentData) => {
      return JSON.parse(JSON.stringify(assignmentData));
    });
  }

  async updateAssignmentByIdWithObject(assignmentId, dataForUpdate) {
    return assignmentModel
      .findByIdAndUpdate(
        assignmentId,
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

  async addTaskNumber(assignmentId) {
    const seqCreatedNo = await updateSeqAssignment('assignment');
    const dataForUpdate = {
      taskNumber: seqCreatedNo,
    };

    return await assignmentModel
      .findByIdAndUpdate(assignmentId, dataForUpdate, {
        upsert: true,
        new: true,
      })
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      });
  }

  async deleteAssignmentOne(assignmentId) {
    try {
      let deleteOne = await assignmentModel.deleteOne({
        _id: assignmentId,
      });
      if (deleteOne['deletedCount'] > 0) return true;
      else return false;
    } catch (error) {
      let errorReturn = JSON.parse('{}');
      errorReturn['code'] = `errorIn-DeleteForm`;
      errorReturn['message'] = error['message'];
      return { error: errorReturn };
    }
  }
}

module.exports = AssignmentRepository;
