const path = require('path');
const mongoose = require('mongoose');
const __dir = require('app-root-path');
const fs = require('fs');
const moment = require('moment-timezone');
const badAnalysisFormModel = require('../forms/bad-analysis-form/bad-analysis-form.model');
const { TrackTypeEnum } = require('../../../constants/forms/track-type.constants');
const criteriaKycModel = require('../forms/criteria-kyc-form/criteria-kyc.model');
const formModel = require('../forms/criteria-qacs-form/criteria-qa-cs.model');
const bitqastConnection = require('../../connect-db');
const templateSchema = new mongoose.Schema({
  title: { type: String },
  targetScore: { type: Number, default: 0 },
  tag: {
    type: String,
    enum: ['bad-analysis', 'criteria-kyc', 'criteria-qa-cs'],
  },
  actived: { type: Boolean, default: true },
  defaultFormId: { type: String, default: null },
  properties: { type: Object },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

templateSchema.post('findByIdAndUpdate', async (doc, next) => {
  const processTime = moment().tz('Asia/Bangkok').unix();
  await templateModel.findByIdAndUpdate(JSON.parse(JSON.stringify(doc))._id, { updatedAt: processTime }).exec();
  next();
});

const templateModel = bitqastConnection.model('templates', templateSchema);

const initialDefaultForm = async (trackType, templateId) => {
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/${trackType}.json`), async (err, data) => {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    if (trackType === TrackTypeEnum.BAD_ANALYSIS) {
      const initDataReadyExits = await badAnalysisFormModel.findOne({ isDefaultForm: true }).exec();
      if (!initDataReadyExits) {
        const schemData = new badAnalysisFormModel(dataFromFile);
        const formIniit = await schemData.save();
        const defaultFormId = formIniit?._id.toString();
        await templateModel.findByIdAndUpdate(templateId, { defaultFormId }, { new: true }).exec();
      }
    } else if (trackType === TrackTypeEnum.KYC) {
      const initDataReadyExits = await criteriaKycModel.findOne({ isDefaultForm: true }).exec();
      if (!initDataReadyExits) {
        const schemData = new criteriaKycModel(dataFromFile);
        const formIniit = await schemData.save();
        const defaultFormId = formIniit?._id.toString();
        await templateModel.findByIdAndUpdate(templateId, { defaultFormId }, { new: true }).exec();
      }
    } else if (trackType === TrackTypeEnum.QA_CS) {
      const initDataReadyExits = await formModel.findOne({ isDefaultForm: true }).exec();
      if (!initDataReadyExits) {
        const schemData = new formModel(dataFromFile);
        const formIniit = await schemData.save();
        const defaultFormId = formIniit?._id.toString();
        await templateModel.findByIdAndUpdate(templateId, { defaultFormId }, { new: true }).exec();
      }
    }
  });
};

const initialFormAndTemplate = async () => {
  const arrayTemplateList = [];
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/templates.json`), async (err, data) => {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    dataFromFile.forEach(async (obj) => {
      const { tag } = obj;
      const templateData = await templateModel.findOne({ tag }).exec();
      if (!templateData || templateData === null) {
        const schema = new templateModel(obj);
        const defaultTemplateCreated = await schema.save();
        await initialDefaultForm(defaultTemplateCreated['tag'], defaultTemplateCreated?._id.toString());
      }
    });
  });
  return arrayTemplateList;
};

initialFormAndTemplate();

module.exports = templateModel;
