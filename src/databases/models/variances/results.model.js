const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const TEMP_MODEL = bitqastConnection.model(
  'results',
  new mongoose.Schema({
    assignmentId: { type: String },
    evaluateId: { type: String },
    referFrom: { type: String, default: '' },
    referId: { type: String, default: '' },
    referTitle: { type: String, default: '' },
    referDetail: { type: String, default: '' },
    values: { type: Array, default: [] },
    tags: { type: Object, default: {} },
    properties: { type: Object, default: {} },
    completedDate: { type: Date, default: () => new Date() },
    createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
    updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  }),
);
module.exports = TEMP_MODEL;
