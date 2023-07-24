require('dotenv').config();
const moment = require('moment-timezone');
const { groupModel } = require('../models');
const { isValidObjectId } = require('mongoose');
class GroupRepository {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getGroupsWithFilter(filter) {
    return groupModel.find(filter).lean();
  }

  async getGroupById(groupId) {
    if (!isValidObjectId(groupId)) return null;
    return groupModel.findOne({ _id: groupId }).lean();
  }

  async getOneByFilter(filter) {
    return groupModel.findOne(filter).lean();
  }

  async checkGroupExist(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return groupModel.exists(filter).then((doc) => !!doc);
  }

  async getOneGroupWithFilter(filter) {
    let errorReturn = JSON.parse('{}');
    try {
      let groupsList = await groupModel.findOne(filter).exec();
      return groupsList;
    } catch (error) {
      errorReturn['code'] = `errorIn-GetOneGroupWithFilter`;
      errorReturn['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify({ error: errorReturn }));
    }
  }

  async create(bodyData) {
    const schemaGroup = new groupModel(bodyData);
    return await schemaGroup.save().then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async updateGroupByObj(groupId, dataForUpdate) {
    return groupModel
      .findByIdAndUpdate(
        groupId,
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

  async deleteGroup(groupId) {
    if (!isValidObjectId(groupId)) return null;
    return groupModel.deleteOne({ _id: groupId }).then(({ deletedCount }) => {
      return deletedCount;
    });
  }
}

module.exports = GroupRepository;
