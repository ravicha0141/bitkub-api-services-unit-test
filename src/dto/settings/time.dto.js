module.exports = {
  createSettingTimeDTO: (doc) => {
    return {
      fieldName: doc.fieldName,
      type: doc.type,
      tag: doc.tag,
      actived: doc.actived,
    };
  },
  updateSettingTimeDTO: (doc) => {
    return {
      fieldName: doc.fieldName,
      type: doc.type,
      tag: doc.tag,
      actived: doc.actived,
    };
  },
};
