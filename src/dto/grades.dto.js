const moment = require('moment-timezone');
module.exports = {
  createGradeDTO: (groupId, grades) => {
    return {
      groupId,
      grades: grades.map((item) => {
        return {
          label: item.label,
          max: item.max,
          min: item.min,
        };
      }),
    };
  },
  updateGradeDTO: (groupId, grades) => {
    return {
      groupId,
      grades: grades.map((item) => {
        return {
          label: item.label,
          max: item.max,
          min: item.min,
        };
      }),
      updatedAt: moment().tz('Asia/Bangkok').unix(),
    };
  },
};
