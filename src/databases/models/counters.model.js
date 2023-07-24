const mongoose = require('mongoose');
const bitqastConnection = require('../connect-db');
const schema = new mongoose.Schema({
  name: String,
  date: String,
  sequence: { type: Number, default: 1 },
});

const counterModel = bitqastConnection.model('counter', schema);
module.exports = counterModel;
