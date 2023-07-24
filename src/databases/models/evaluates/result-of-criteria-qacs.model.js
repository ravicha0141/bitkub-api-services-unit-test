const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const resultEvaluateOfQaCsSchema = new mongoose.Schema({
  assignmentId: { type: String },
  evaluateId: { type: String },
  groupId: { type: String, default: null },
  referFrom: { type: String, default: '' },
  referId: { type: String, default: '' },
  referOrder: { type: String, default: '' },
  referTitle: { type: String, default: '' },
  referDetail: { type: String, default: '' },
  values: { type: Array, default: [] },
  comment: { type: String, default: '' },
  tags: { type: Object, default: {} },
  properties: { type: Object, default: {} },
  completedDate: { type: Date, default: () => new Date() },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const resultEvaluateOfQaCsModel = bitqastConnection.model('criteria_qacs_results', resultEvaluateOfQaCsSchema);
module.exports = resultEvaluateOfQaCsModel;
