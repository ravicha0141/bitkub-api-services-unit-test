const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../../connect-db');
const schema = new mongoose.Schema({
  formId: { type: String },
  order: { type: String, default: '' },
  questionId: { type: String },
  title: { type: String },
  detail: { type: String, default: '' },
  weight: { type: Number, default: null },
  faltalNonFaltal: { type: String, default: '' },
  properties: { type: Object, default: {} },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const criteriaQacsItemModel = bitqastConnection.model('criteria_qacs_items', schema);
module.exports = criteriaQacsItemModel;
