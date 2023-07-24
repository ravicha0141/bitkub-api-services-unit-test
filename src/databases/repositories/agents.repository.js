require('dotenv').config();
const { agentModel } = require('../models');
const { isValidObjectId } = require('mongoose');

class AgentRepository {
  constructor() {}

  async getAll(query) {
    if ('_id' in query && !isValidObjectId(query._id)) return null;
    return agentModel.find(query).lean();
  }

  async getOneByFilter(query) {
    if ('_id' in query && !isValidObjectId(query._id)) return null;
    return agentModel.findOne(query).lean();
  }

  async checkAgentExist(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return agentModel.exists(filter).then((doc) => !!doc);
  }

  async create(bodyData) {
    const schemUser = new agentModel(bodyData);
    const userCreated = await schemUser.save();
    return JSON.parse(JSON.stringify(userCreated));
  }

  async deleteOne(agentId) {
    if (!isValidObjectId(agentId)) return null;
    return agentModel.findOneAndDelete({ _id: agentId });
  }
}

module.exports = AgentRepository;
