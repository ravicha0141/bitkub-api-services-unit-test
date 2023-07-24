const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { VarianceStatusEnumArray, VarianceStatusEnum } = require('../../../constants/variances.constants');
const bitqastConnection = require('../../connect-db');
const varianceSchema = new mongoose.Schema({
  formId: { type: String },
  evaluateId: { type: String },
  assignmentId: { type: String },
  taskNumber: { type: String },
  assignmentRef: { type: String },
  trackType: { type: String },
  agentId: { type: String },
  agentEmail: { type: String },
  agentName: { type: String },
  agentEmployeeId: { type: String, default: '' },
  groupId: { type: String, default: '' },
  fileId: { type: String },
  fileType: { type: String },
  fileName: { type: String },
  targetScore: { type: Number },
  qaAgentId: { type: String },
  qaAgentEmail: { type: String, default: '' },
  superVisorId: { type: String, default: '' },
  superVisorEmail: { type: String, default: '' },
  fatalDeduction: { type: String },
  monitoringDate: { type: Number },
  netScore: { type: Number, default: null },
  monitoringTime: { type: Number },
  areaOfStrength: { type: String, default: '' },
  areaOfImprovement: { type: String, default: '' },
  note: { type: String, default: '' },
  internalNote: { type: String, default: '' },
  isDispute: { type: Boolean, default: false },
  status: {
    type: String,
    default: VarianceStatusEnum.PENDING,
    enum: VarianceStatusEnumArray,
  },
  tags: { type: Object, default: {} },
  result: { type: String, default: '' },
  differenceValue: { type: Number, default: null },
  date: { type: String, default: () => moment().tz('Asia/Bangkok').format('YYYY-MM-DD') },
  completedDate: { type: Date, default: null },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const varianceModel = bitqastConnection.model('variances', varianceSchema);
module.exports = varianceModel;
