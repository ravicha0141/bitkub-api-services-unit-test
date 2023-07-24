const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const questionSchema = new mongoose.Schema({
  questionId: { type: String },
  nonFatal: { type: Boolean, default: false },
  weightageScore: { type: Number },
  result: { type: String },
  comments: [{ type: String }],
  concernIssueValue: { type: String },
  errorTypeValue: { type: String, default: '' },
  futherExplanationValue: { type: String, default: '' },
  qaNoteValue: { type: String, default: '' },
  varianceResult: { type: Boolean, default: null },
  supQaComment: { type: String, default: '' },
});

const ResultOfCriteriaKycSchema = new mongoose.Schema({
  criteriaKycFormId: { type: String },
  evaluateId: { type: String },
  groupId: { type: String, default: null },
  totalWeight: { type: Number, default: null },
  netScore: { type: Number, default: null },
  areaOfStrength: { type: String, default: '' },
  areaOfImprovement: { type: String, default: '' },
  listQuestions: [{ type: questionSchema }],
  isVarianced: { type: Boolean, default: false },
  completedDate: { type: Date, default: () => new Date() },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const resultOfCriteriaKycModel = bitqastConnection.model('criteria_kyc_results', ResultOfCriteriaKycSchema);
module.exports = resultOfCriteriaKycModel;
