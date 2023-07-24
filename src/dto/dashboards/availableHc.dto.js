module.exports = {
  createAvailableHcDTO: (doc) => {
    return {
      tag: doc.tag,
      key: doc.key,
      date: doc.date,
      properties: {
        startedFormat: doc.properties.startedFormat || '',
        endedFormat: doc.properties.endedFormat || '',
        startedUnix: doc.properties.startedUnix || null,
        endedUnix: doc.properties.endedUnix || null,
        groupId: doc.properties.groupId || '',
        amount: doc.properties.amount || 0,
      },
    };
  },
  updateAvailableHcDTO: (doc) => {
    return {
      tag: doc.tag,
      key: doc.key,
      date: doc.date,
      properties: {
        startedFormat: doc.properties.startedFormat || '',
        endedFormat: doc.properties.endedFormat || '',
        startedUnix: doc.properties.startedUnix || null,
        endedUnix: doc.properties.endedUnix || null,
        groupId: doc.properties.groupId || '',
        amount: doc.properties.amount || 0,
      },
    };
  },
};
