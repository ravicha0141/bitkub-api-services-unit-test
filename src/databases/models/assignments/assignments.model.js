const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const assignmentSchema = new mongoose.Schema({
  trackType: { type: String },
  formId: { type: String },
  assignDate: { type: String, default: () => moment().tz('Asia/Bangkok').format('YYYY-MM-DD') },
  assignmentDateTime: { type: Number, default: null },
  qaAgentId: { type: String },
  qaAgentName: { type: String },
  qaAgentEmail: { type: String },
  agentId: { type: String },
  agentEmail: { type: String },
  groupId: { type: String },
  groupName: { type: String },
  fileId: { type: String },
  fileType: { type: String },
  fileName: { type: String },
  fileKey: { type: String, default: '' },
  fileUri: { type: String },
  fileSize: { type: Number },
  activated: { type: Boolean, default: false },
  varianced: { type: Boolean, default: false },
  varianceId: { type: String, default: null },
  status: { type: String, default: 'pending' },
  taskNumber: { type: String },
  netScore: { type: Number, default: null },
  completedDate: { type: Date, default: null },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const assignmentModel = bitqastConnection.model('assignments', assignmentSchema);
module.exports = assignmentModel;
