module.exports = {
  createSummaryProcessHcDTO: (doc) => {
    let latestUpdate = null;
    let taskNumber = '';
    let processTime = null;
    if (doc['properties']) {
      latestUpdate = doc.createdAt;
      taskNumber = doc.properties.taskNumber;
      processTime = doc.processTime;
    }
    return {
      tag: doc.tag || '',
      key: doc.key || '',
      date: doc.date || '',
      latestUpdate,
      taskNumber,
      processTime,
    };
  },
};
