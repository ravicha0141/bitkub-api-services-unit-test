const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const __dir = require('app-root-path');
const fs = require('fs');
const moment = require('moment-timezone');
const bitqastConnection = require('../connect-db');
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String, select: false },
  email: { type: String },
  level: {
    type: String,
    default: 'qaAgent',
    enum: ['qaAgent', 'superVisor', 'assistManager', 'systemAdmin'],
  },
  status: {
    type: String,
    default: 'unlock',
    enum: ['active', 'deactive', 'unlock'],
  },
  type: {
    type: String,
    default: 'SSO_AUTHEN',
    enum: ['SSO_AUTHEN', 'SITE_AUTHEN'],
  },
  imageId: { type: String, default: null },
  signatureId: { type: String, default: null },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});

const userModel = bitqastConnection.model('users', userSchema);
const initialData = async () => {
  fs.readFile(path.resolve(`${__dir}/src/databases/initializations/system-admin.json`), function (err, data) {
    if (err) return console.error(err);
    const dataFromFile = JSON.parse(data);
    dataFromFile.forEach(async (obj) => {
      await userModel
        .findOne({ username: obj['username'], level: obj['level'] })
        .then(async (results) => {
          if (!results) {
            const hashPassword = bcrypt.hashSync(obj['password'], bcrypt.genSaltSync(8), null);
            const schema = new userModel({ ...obj, password: hashPassword });
            await schema.save();
          }
        })
        .catch(() => {});
    });
  });
};

initialData();

module.exports = userModel;
