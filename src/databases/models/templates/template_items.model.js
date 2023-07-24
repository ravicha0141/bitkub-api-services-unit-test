const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const itemOfTemplateSchema = new mongoose.Schema({
  templateId: { type: String },
  questionId: { type: String },
  title: { type: String, default: '' },
  detail: { type: String, default: '' },
  weight: { type: Number, default: null },
  order: { type: String, default: '' },
  properties: { type: Object },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const itemOfTemplateModel = bitqastConnection.model('template_items', itemOfTemplateSchema);
module.exports = itemOfTemplateModel;
