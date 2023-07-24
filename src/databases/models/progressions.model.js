const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const schema = new mongoose.Schema({
  qaAgentId: { type: String },
  qaAgentEmail: { type: String },
  groupId: { type: String },
  groupName: { type: String },
  type: { type: String, enum: ['on-duty'] },
  date: { type: String },
  status: { type: Boolean, default: false },
  startTime: { type: Number },
  endTime: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  properties: { type: Object, default: {} },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const progressionModel = bitqastConnection.model('progressions', schema);
module.exports = progressionModel;
