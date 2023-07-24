const { getDb } = require('../db');

exports.up = async (next) => {
  const db = await getDb();
  await db.collection('criteria_kyc_forms').updateMany({ errorTypes: null }, { $set: { errorTypes: [] } });
  await db.collection('criteria_kyc_forms').updateMany({ futherExplanations: null }, { $set: { futherExplanations: [] } });
  await db.collection('criteria_kyc_forms').updateMany({ qaNote: null }, { $set: { qaNote: '' } });
  next();
};

exports.down = async (next) => {
  next();
};
