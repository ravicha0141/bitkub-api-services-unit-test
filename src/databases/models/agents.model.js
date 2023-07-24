const mongoose = require('mongoose');
const path = require('path');
const __dir = require('app-root-path');
const fs = require('fs');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');

const agentSchema = new mongoose.Schema({
  email: String,
  agentNumber: { type: String, default: '' },
  employeeId: { type: String, default: '' },
  username: String,
  name: String,
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const agentModel = bitqastConnection.model('agents', agentSchema);

const initialData = async () => {
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/agents.json`), function (err, data) {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    dataFromFile.forEach(async (obj) => {
      await agentModel
        .findOne({ email: obj['email'] })
        .then(async (results) => {
          if (!results) {
            const schema = new agentModel(obj);
            await schema.save();
          }
        })
        .catch(() => {});
    });
  });
};

initialData();
module.exports = agentModel;
