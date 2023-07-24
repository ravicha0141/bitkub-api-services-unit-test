const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const schemData = new mongoose.Schema({
  formId: { type: String },
  trackType: { type: String },
  assignmentId: { type: String },
  evaluateId: { type: String },
  taskNumber: { type: String },
  agentEmail: { type: Object },
  qaAgent: { type: String },
  groupId: { type: String },
  superVisorEmail: { type: String, default: '' },
  agentReason: { type: String, default: '' },
  agentReasonDate: { type: Number, default: null },
  qaReason: { type: String, default: '' },
  qaReasonDate: { type: Number, default: null },
  disputeStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'agreed', 'disagreed'],
  },
  dateOfMonitoring: { type: Number },
  tags: { type: Object },
  completedDate: { type: Date, default: () => new Date() },
  createdDateFormat: { type: Date, default: () => new Date() },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const disputeModel = bitqastConnection.model('disputes', schemData);
module.exports = disputeModel;
