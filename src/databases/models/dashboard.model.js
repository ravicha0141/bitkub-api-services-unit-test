const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const schema = new mongoose.Schema({
  tag: { type: String, default: '' },
  key: { type: String, default: '' },
  date: { type: String, default: '' },
  processTime: { type: Number },
  properties: { type: Object, default: {} },
  archived: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const dashboardModel = bitqastConnection.model('dashboards', schema);
module.exports = dashboardModel;
