const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const itemOfRecord = new mongoose.Schema({
  key: { type: String, default: '' },
  value: { type: String, default: '' },
  title: { type: String, default: '' },
});

const BadAnalysisReportRawSchema = new mongoose.Schema({
  qaAgentId: { type: String, require: true },
  badAnalysisId: { type: String, require: true },
  groupId: { type: String, require: true },
  qaAgentName: { type: String, default: '' },
  qaAgentEmail: { type: String, default: '' },
  formTitle: { type: String, default: '' },
  groupName: { type: String, default: '' },
  records: [{ type: itemOfRecord }],
  average: { type: Number, default: '' },
  grade: { type: String, default: '' },
  startDate: { type: Number, default: null },
  endDate: { type: Number, default: null },
  data: {},
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const reportOfBadAnalysisModel = bitqastConnection.model('report_bad_analysis', BadAnalysisReportRawSchema);
module.exports = reportOfBadAnalysisModel;
