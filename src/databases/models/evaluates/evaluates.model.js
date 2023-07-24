const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const itemOfOnBreakTime = new mongoose.Schema({
  onBreakTimeId: { type: String },
  action: { type: String },
  startDate: { type: Date },
  endDate: { type: Date, default: null },
  amount: { type: Number, default: null },
  archived: { type: Boolean, default: false },
});

const evaluateSchema = new mongoose.Schema({
  formId: { type: String },
  assignmentId: { type: String },
  taskNumber: { type: String },
  assignmentRef: { type: String },
  trackType: { type: String, default: '' },
  agentId: { type: String },
  agentEmail: { type: String },
  agentName: { type: String },
  agentEmployeeId: { type: String, default: '' },
  groupId: { type: String, default: '' },
  fileId: { type: String },
  fileType: { type: String },
  fileName: { type: String },
  fileKey: { type: String, default: '' },
  fileSize: { type: Number, default: null },
  targetScore: { type: Number },
  qaAgentId: { type: String },
  qaAgentEmail: { type: String, default: '' },
  fatalDeduction: { type: String },
  monitoringDate: { type: Number },
  netScore: { type: Number, default: null },
  percentage: { type: Number, default: null },
  totalWeight: { type: Number, default: null },
  monitoringTime: { type: Number },
  areaOfStrength: { type: String, default: '' },
  areaOfImprovement: { type: String, default: '' },
  bpo: { type: String, default: '-' },
  language: { type: String, default: '' },
  uid: { type: String, default: '' },
  dateOfCall: { type: String, default: '' },
  timeOfCall: { type: String, default: '' },

  note: { type: String, default: '' },
  internalNote: { type: String, default: '' },
  isDispute: { type: Boolean, default: false },
  status: {
    type: String,
    default: 'inprogress',
    enum: ['inprogress', 'disputed', 'completed', 'on-breaking'],
  },
  onBreakTimes: [{ type: itemOfOnBreakTime }],
  tags: { type: Object, default: {} },
  result: { type: String, default: '' },
  date: { type: String, default: () => moment().tz('Asia/Bangkok').format('YYYY-MM-DD') },
  completedDate: { type: Date, default: null },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const evaluateModel = bitqastConnection.model('evaluates', evaluateSchema);
module.exports = evaluateModel;
