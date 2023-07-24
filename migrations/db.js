const { MongoClient } = require('mongodb');
require('dotenv').config();
const getConnectionString = () => {
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USERNAME;
  const dbPass = encodeURIComponent(process.env.DB_PASSWORD);
  const dbAuthDb = process.env.DB_AUTH;
  return `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=${dbAuthDb}`;
};

const getDb = async () => {
  const connectionStringUri = getConnectionString();
  const client = new MongoClient(connectionStringUri, { directConnection: true });
  await client.connect();
  return client.db();
};

module.exports = { getDb };
