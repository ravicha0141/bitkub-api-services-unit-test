const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const consentSchema = new mongoose.Schema({
  groupId: { type: String },
  groupName: { type: String, default: '' },
  userRequest: { type: String, default: '' },
  changeListts: { type: Array },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  achieved: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const consentModel = bitqastConnection.model('consents', consentSchema);

module.exports = consentModel;
