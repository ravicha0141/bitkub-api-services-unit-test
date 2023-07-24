const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const issueOfBadAnalysis = new mongoose.Schema({
  referId: { type: String, default: '' },
  value: { type: String, default: '' },
  order: { type: Number, default: null },
});

const ChoiceOfBadSchema = new mongoose.Schema({
  referId: { type: String, default: '' },
  choiceName: { type: String, default: '' },
  order: { type: Number, default: null },
});

const ChoiceWithIssueOfBadSchema = new mongoose.Schema({
  referId: { type: String, default: '' },
  choiceName: { type: String, default: '' },
  issues: issueOfBadAnalysis,
  order: { type: Number, default: null },
});

const ResultOfBadAnalysisFormSchema = new mongoose.Schema({
  badAnalysisId: { type: String, required: true },
  evaluateId: { type: String, default: '' },
  qaAgentId: { type: String, required: true },
  groupId: { type: String, default: null },
  groupName: { type: String },
  channelOfBad: ChoiceOfBadSchema,
  reasonForBad: ChoiceWithIssueOfBadSchema,
  issueForBad: ChoiceOfBadSchema,
  organizationOfBad: ChoiceOfBadSchema,
  suggestionForBad: { type: String },
  result: { type: String },
  isVarianced: { type: Boolean, default: false },
  completedDate: { type: Date, default: () => new Date() },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const resultOfBadAnalysisFormModel = bitqastConnection.model('bad_analysis_result', ResultOfBadAnalysisFormSchema);
module.exports = resultOfBadAnalysisFormModel;
