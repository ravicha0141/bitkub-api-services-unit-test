const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { TrackTypeEnum } = require('../../../../constants/forms/track-type.constants');
const bitqastConnection = require('../../../connect-db');
const issueOfBadAnalysis = new mongoose.Schema({
  value: { type: String, default: '' },
  order: { type: Number, default: null },
});

const ChoiceOfBadSchema = new mongoose.Schema({
  choiceName: { type: String, default: '' },
  order: { type: Number, default: null },
});

const ChoiceWithIssueOfBadSchema = new mongoose.Schema({
  choiceName: { type: String, default: '' },
  issues: [{ type: issueOfBadAnalysis }],
  order: { type: Number, default: null },
});
const BadAnalysisFormSchema = new mongoose.Schema({
  trackType: { type: String, default: TrackTypeEnum.BAD_ANALYSIS },
  name: { type: String, default: '', require: true },
  targetScore: {
    type: Number,
    default: null,
    require: true,
  },
  channelOfBad: [{ type: ChoiceOfBadSchema }],
  reasonForBad: [{ type: ChoiceWithIssueOfBadSchema }],
  issueForBad: [{ type: ChoiceOfBadSchema }],
  organizationOfBad: [{ type: ChoiceOfBadSchema }],
  actived: { type: Boolean, default: true },
  isDefaultForm: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const badAnalysisFormModel = bitqastConnection.model('bad_analysis_form', BadAnalysisFormSchema);
module.exports = badAnalysisFormModel;
