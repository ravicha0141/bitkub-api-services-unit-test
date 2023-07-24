const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bitqastConnection = require('../../connect-db');
const schema = new mongoose.Schema({
  fileName: { type: String },
  typeFile: { type: String },
  sourceFile: { type: String },
  uri: { type: String },
  fieldname: { type: String },
  originalname: { type: String },
  size: { type: Number, default: 0 },
  bucket: { type: String },
  key: { type: String },
  location: { type: String },
  etag: { type: String },
  createdAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
  updatedAt: { type: Number, default: () => moment().tz('Asia/Bangkok').unix() },
});
const attachmentModel = bitqastConnection.model('storages', schema);
module.exports = attachmentModel;
