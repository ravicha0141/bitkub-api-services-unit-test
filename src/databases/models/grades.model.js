const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const schema = new mongoose.Schema({
  groupId: String,
  grades: [
    {
      _id: false,
      label: String,
      max: Number,
      min: Number,
    },
  ],
  createdAt: {
    type: Number,
    default: () => moment().tz('Asia/Bangkok').unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().tz('Asia/Bangkok').unix(),
  },
});

const gradeModel = bitqastConnection.model('grades', schema);
module.exports = gradeModel;
