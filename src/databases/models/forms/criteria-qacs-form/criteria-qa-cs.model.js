const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../../connect-db');
const criteriaQaCsformSchema = new mongoose.Schema({
  tagForm: { type: String },
  name: { type: String },
  targetScore: { type: Number, default: 0 },
  trackType: {
    type: String,
    default: 'criteria-qa-cs',
    enum: ['criteria-kyc', 'criteria-qa-cs'],
  },
  actived: { type: Boolean, default: true },
  isDefaultForm: { type: Boolean, default: false },
  properties: { type: Object },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const criteriaQaCsFormModel = bitqastConnection.model('criteria_qacs_forms', criteriaQaCsformSchema);

module.exports = criteriaQaCsFormModel;
