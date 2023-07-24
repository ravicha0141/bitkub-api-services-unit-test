const moment = require('moment-timezone');
const { counterModel } = require('../databases/models');

const updateSeqAssignment = async (modelName) => {
  return 'test';
  const dateStrNow = moment().tz('Asia/Bangkok').format('YYYYMMDD');
  const seqData = await counterModel
    .findOneAndUpdate({ name: modelName, date: dateStrNow }, { $inc: { sequence: 1 } }, { new: true })
    .then((result) => {
      return JSON.parse(JSON.stringify(result));
    });
  if (!seqData) {
    const modelforCreate = new counterModel({ name: modelName, date: dateStrNow, seq: 1 });
    const seqCreated = await modelforCreate.save();
    const seqNo = seqCreated.sequence;
    const dateStr = seqCreated.date;
    return await setFormatTicketNumber(dateStr, seqNo);
  }
  const seqNo = seqData.sequence;
  const dateStr = seqData.date;
  return await setFormatTicketNumber(dateStr, seqNo);
};

const setFormatTicketNumber = async (dateStr, seqNumber) => {
  return `TN-${dateStr}-${seqNumber.toString().padStart(6, '0')}`;
};

module.exports = {
  updateSeqAssignment,
};
