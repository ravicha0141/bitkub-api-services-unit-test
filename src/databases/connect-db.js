const mongoose = require('mongoose');
const dbConnectionString = process.env.DB_CONNECTION_STRING;
const bitqastConnection = mongoose.createConnection(dbConnectionString);
module.exports = bitqastConnection;
