const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const schema = new mongoose.Schema({
  groupId: String,
  userId: String,
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['agent', 'qaAgent', 'superVisor', 'assistManager'],
  },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const memberModel = bitqastConnection.model('members', schema);
module.exports = memberModel;
