const { gradeModel } = require('../../models');
const { isValidObjectId } = require('mongoose');

class GradeRepository {
  constructor() {}

  async isExist(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return gradeModel.exists(filter).then((doc) => !!doc);
  }

  async getListWithFilter(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return gradeModel.find(filter).lean();
  }

  async getOneWithFilter(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return gradeModel.findOne(filter).lean();
  }

  async create(dataForCreate) {
    return gradeModel.create(dataForCreate);
  }

  async update(gradeId, dataForUpdate) {
    if (!isValidObjectId(gradeId)) return null;
    const doc = await gradeModel.findById(gradeId);
    doc.groupId = dataForUpdate.groupId;
    doc.grades = dataForUpdate.grades;
    doc.updatedAt = dataForUpdate.updatedAt;
    return await doc.save();
  }

  async deleteOne(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return gradeModel.findOneAndDelete(filter);
  }
}

module.exports = GradeRepository;
