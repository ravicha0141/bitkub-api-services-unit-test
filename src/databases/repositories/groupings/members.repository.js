require('dotenv').config();
const { memberModel, groupModel } = require('../../models');
const { isValidObjectId } = require('mongoose');

class MemberRepository {
  constructor() {}
  async getMemberAndGroupInfo(filter) {
    return new Promise((resolve, reject) => {
      memberModel
        .find(filter)
        .lean()
        .then(async (members) => {
          const groupsData = await groupModel.find({ _id: { $in: members.map(({ groupId }) => groupId) } }).lean();
          const mapGroupData = groupsData.reduce((acc, cur) => acc.set(cur._id.toString(), cur), new Map());
          resolve(
            members.map((m) => {
              m.groupInfo = mapGroupData.get(m.groupId);
              return m;
            }),
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getListWithFilter(filter) {
    return memberModel.find(filter).lean();
  }

  async getOneWithFilter(filter) {
    return memberModel.findOne(filter).lean();
  }

  async checkMemberExist(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return memberModel.exists(filter).then((doc) => !!doc);
  }

  async create(dataForCreate) {
    const schemData = new memberModel(dataForCreate);
    return schemData.save().then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  async deleteOne(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return memberModel.findOneAndDelete(filter);
  }

  async countMemberWithFilter(filter) {
    return memberModel.countDocuments(filter);
  }
}

module.exports = MemberRepository;
