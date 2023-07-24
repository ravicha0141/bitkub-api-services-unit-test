const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');

const auditLogSchema = new mongoose.Schema({
  userId: { type: String },
  service: { type: String },
  action: { type: String },
  key: { type: String },
  processTime: { type: Number },
  reason: { type: String, default: '' },
  tag: { type: String, default: '' },
  properties: { type: Object, default: {} },
  qaAgentEmail: { type: String },
  groupId: { type: String },
  groupName: { type: String },
  date: { type: String, default: () => moment().tz('Asia/Bangkok').format('YYYY-MM-DD') },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

auditLogSchema.post('findByIdAndUpdate', async (doc, next) => {
  const processTime = moment().tz('Asia/Bangkok').unix();
  await auditlogModel.findByIdAndUpdate(JSON.parse(JSON.stringify(doc))._id, { updatedAt: processTime }).exec();
  next();
});

const auditlogModel = bitqastConnection.model('auditlogs', auditLogSchema);
module.exports = auditlogModel;
