const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const requestSigninSchema = new mongoose.Schema({
  email: { type: String },
  count: { type: Number },
  status: { type: String },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const requestSigninModel = bitqastConnection.model('request_signin', requestSigninSchema);
module.exports = requestSigninModel;
