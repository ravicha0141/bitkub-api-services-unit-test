const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../../connect-db');
const schema = new mongoose.Schema({
  formId: { type: String },
  order: { type: String, default: '' },
  title: { type: String },
  detail: { type: String, default: '' },
  weight: { type: Number, default: null },
  properties: { type: Object, default: {} },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const criteriaQacsQuestionModel = bitqastConnection.model('criteria_qacs_questions', schema);
module.exports = criteriaQacsQuestionModel;
