const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const questionOfTemplateSchema = new mongoose.Schema({
  templateId: { type: String },
  title: { type: String },
  detail: { type: String },
  weight: { type: Number },
  order: { type: String, default: '' },
  properties: { type: Object },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const templateQuestionModel = bitqastConnection.model('template_questions', questionOfTemplateSchema);
module.exports = templateQuestionModel;
