const { getDb } = require('./db');

class Store {
  async load(fn) {
    let data = null;
    try {
      const db = await getDb();
      data = await db.collection('db_migrations').find().toArray();
      if (data.length !== 1) {
        console.log('Cannot read migrations from database. If this is the first time you run migrations, then this is normal.');
        return fn(null, {});
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
    return fn(null, data[0]);
  }
  async save(set, fn) {
    let result = null;
    try {
      const db = await getDb();
      const { migrations: newMigrateSets } = set;
      const migrateData = await db.collection('db_migrations').findOne({});
      let migrateUpdate = [];
      if (!migrateData) {
        migrateUpdate = newMigrateSets.filter((oldData) => oldData.timestamp !== null);
      } else {
        const { migrations: currentMigrate } = migrateData;
        for (const newMigrate of newMigrateSets) {
          const oldMigrateData = currentMigrate.find((oldData) => oldData.title === newMigrate.title);
          if (newMigrate.timestamp !== null && !oldMigrateData) migrateUpdate.push(newMigrate);
        }
      }
      result = await db.collection('db_migrations').updateOne(
        {},
        {
          $set: {
            lastRun: set.lastRun,
          },
          $push: {
            migrations: { $each: migrateUpdate },
          },
        },
        { upsert: true },
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
    return fn(null, result);
  }
}
module.exports = Store;
