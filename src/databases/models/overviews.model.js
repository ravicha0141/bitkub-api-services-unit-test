const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const overviewSchema = new mongoose.Schema({
  title: String,
  onBreaksStatus: Number,
  consultStatus: Number,
  meetingStatus: Number,
  technicalIssueStatus: Number,
  healthIssuesStatus: Number,
  availableStatus: Number,
  redStatus: { type: Boolean, default: false },
  redOnStatus: { type: Number },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

overviewSchema.post('findByIdAndUpdate', async (doc, next) => {
  const processTime = moment().tz('Asia/Bangkok').unix();
  await overviewModel.findByIdAndUpdate(JSON.parse(JSON.stringify(doc))._id, { updatedAt: processTime }).exec();
  next();
});

const overviewModel = bitqastConnection.model('overviews', overviewSchema);
const initialCategory = async () => {
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/overviews.json`), function (err, data) {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    dataFromFile.forEach(async (obj) => {
      await overviewModel
        .findOne({ title: obj['title'] })
        .then(async (results) => {
          if (!results) {
            const schema = new overviewModel(obj);
            await schema.save();
          }
        })
        .catch(() => {});
    });
  });
};
initialCategory();
module.exports = overviewModel;
