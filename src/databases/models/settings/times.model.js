const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const timeSettingSchema = new mongoose.Schema({
  fieldName: String,
  type: String,
  tag: String,
  actived: Boolean,
  properties: Object,
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const timeSettingsModel = bitqastConnection.model('settings_times', timeSettingSchema);
module.exports = timeSettingsModel;
