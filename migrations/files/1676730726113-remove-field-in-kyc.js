const { getDb } = require('../db');

exports.up = async (next) => {
  const db = await getDb();
  await db.collection('criteria_kyc_forms').updateMany({ organizations: { $ne: null } }, { $unset: { organizations: 1 } });
  next();
};

exports.down = async (next) => {
  next();
};
