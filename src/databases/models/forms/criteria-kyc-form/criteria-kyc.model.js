const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../../connect-db');
const concernIssueSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  order: { type: Number, default: null },
});

const itemSchema = new mongoose.Schema({
  order: { type: Number, default: null },
  title: { type: String, default: '' },
  detail: { type: String, default: '' },
});

const listQuestionSchema = new mongoose.Schema({
  order: { type: Number, default: null },
  title: { type: String, default: '' },
  detail: { type: String, default: '' },
  nonFatal: { type: Boolean, default: false },
  weight: { type: Number, default: null },
  listItems: [{ type: itemSchema }],
});

const CriteriaKycSchema = new mongoose.Schema({
  trackType: { type: String, default: 'criteria-kyc' },
  name: { type: String, default: '', require: true },
  targetScore: { type: Number, default: null },
  concernIssues: [{ type: concernIssueSchema }],
  listQuestions: [{ type: listQuestionSchema }],
  errorTypes: [{ type: concernIssueSchema }],
  futherExplanations: [{ type: concernIssueSchema }],
  actived: { type: Boolean, default: true },
  isDefaultForm: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const criteriaKycModel = bitqastConnection.model('criteria_kyc_forms', CriteriaKycSchema);
module.exports = criteriaKycModel;
