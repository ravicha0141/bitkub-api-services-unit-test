module.exports = {
  createDashboardOfAgentStatusDTO: (doc) => {
    return {
      tag: doc.tag,
      key: doc.key,
      date: doc.date,
      properties: {
        startedFormat: doc.properties.startedFormat || '',
        endedFormat: doc.properties.endedFormat || '',
        startedUnix: doc.properties.startedUnix || null,
        endedUnix: doc.properties.endedUnix || null,
        amount: doc.properties.amount || 0,
      },
      archived: doc.archived || false,
    };
  },
  updateDashboardOfAgentStatusDTO: (doc) => {
    return {
      tag: doc.tag,
      key: doc.key,
      date: doc.date,
      properties: {
        startedFormat: doc.properties.startedFormat || '',
        endedFormat: doc.properties.endedFormat || '',
        startedUnix: doc.properties.startedUnix || null,
        endedUnix: doc.properties.endedUnix || null,
        amount: doc.properties.amount || 0,
      },
      archived: doc.archived,
    };
  },
};
