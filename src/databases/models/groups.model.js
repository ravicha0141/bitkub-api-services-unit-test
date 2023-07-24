const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const groupSchema = new mongoose.Schema({
  name: String,
  tag: String,
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const groupModel = bitqastConnection.model('groups', groupSchema);
module.exports = groupModel;
