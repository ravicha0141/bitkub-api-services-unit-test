const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const userAuthenSchema = new mongoose.Schema({
  email: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  remember: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const userAuthenModel = bitqastConnection.model('user_authens', userAuthenSchema);
module.exports = userAuthenModel;
