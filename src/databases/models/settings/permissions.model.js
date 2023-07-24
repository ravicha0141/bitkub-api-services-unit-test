const mongoose = require('mongoose');
const path = require('path');
const __dir = require('app-root-path');
const moment = require('moment-timezone');
const fs = require('fs');
const bitqastConnection = require('../../connect-db');
const permissionSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  key: String,
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const initialData = async () => {
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/permissions.json`), function (err, data) {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    dataFromFile.forEach(async (obj) => {
      await permissionModel
        .findOne({ key: obj['key'] })
        .then(async (results) => {
          if (!results) {
            const schema = new permissionModel(obj);
            await schema.save();
          }
        })
        .catch(() => {});
    });
  });
};
initialData();
const permissionModel = bitqastConnection.model('permissions', permissionSchema);
module.exports = permissionModel;
