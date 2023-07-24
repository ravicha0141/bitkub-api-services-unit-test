const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const onBreakTimeSchema = new mongoose.Schema({
  action: { type: String },
  evaluateId: { type: String },
  qaAgentId: { type: String },
  startDate: { type: Date, default: new Date() },
  endDate: { type: Date, default: null },
  amount: { type: Number, default: 0 },
  archived: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const onBreakTimeModel = bitqastConnection.model('on_break_times', onBreakTimeSchema);
module.exports = { onBreakTimeModel };
