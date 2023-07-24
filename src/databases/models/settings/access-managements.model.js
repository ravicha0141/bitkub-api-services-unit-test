const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const accessManagementSchema = new mongoose.Schema({
  name: { type: String },
  groupId: { type: String },
  permissionId: { type: String },
  permissionName: { type: String, default: '' },
  permissionKey: { type: String, default: '' },
  actived: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const accessManagementModel = bitqastConnection.model('access_managements', accessManagementSchema);
module.exports = accessManagementModel;
