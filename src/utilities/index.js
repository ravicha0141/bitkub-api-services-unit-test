const moment = require('moment-timezone');
const englishSetString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberSetString = '0123456789';
let ENGLISH = {};
let NUMBERS = {};
englishSetString.split('').forEach((char) => {
  ENGLISH[char] = true;
});
numberSetString.split('').forEach((char) => {
  NUMBERS[char] = true;
});

const getKeyOfObjectAsString = (object, key) => {
  let arrays = [];
  for (const keyInObject in object) {
    let preFixKey = key ? `${key}.` : '';
    if (typeof object[keyInObject] === 'object') {
      const _key = getKeyOfObjectAsString(object[keyInObject], keyInObject);
      let preFixKey = key ? `${key}.` : '';
      arrays.push(`${preFixKey}${keyInObject}.${_key}`);
    } else if (typeof object[keyInObject] === 'boolean') {
      arrays.push(`${preFixKey}${keyInObject}:${object[keyInObject]}`);
    }
  }
  return arrays;
};
const getKeyOfObject = (object) => {
  const arrayAuthors = getKeyOfObjectAsString(object);
  return arrayAuthors;
};
const StringifyCustom = (obj) => {
  let objString = '';
  objString += '{';
  if (typeof obj === 'string') {
    return obj;
  } else {
    for (const key in obj) {
      const value = obj[key];
      objString += `"${key}":`;
      if (Array.isArray(obj[key])) {
        for (const element of obj[key]) {
          objString += `${StringifyCustom(element)}`;
        }
      } else if (typeof obj[key] === 'object') {
        objString += `${StringifyCustom(value)}`;
      } else if (typeof value === 'string') {
        if (value.substring(0, 2) === `{"`) {
          objString += `${value}`;
        } else {
          objString += JSON.stringify(value);
        }
      } else if (typeof obj[key] === 'number') {
        objString += `${value}`;
      } else {
        objString += `""`;
      }
      objString += `,`;
    }
    objString += '}';
    return objString;
  }
};
const SubString = (payload, lengthEnable = false, lengthCut = 1000) => {
  try {
    const convertedString = StringifyCustom(payload);
    if (lengthEnable) {
      return `${convertedString.substring(0, Number(lengthCut))}`;
    }
    return convertedString;
  } catch (error) {
    return 'undefined';
  }
};
module.exports = {
  percentage(partialValue, totalValue) {
    return ((partialValue * 100) / totalValue).toFixed(2);
  },
  ratioValue(partialValue, totalValue) {
    return (partialValue / totalValue).toFixed(2);
  },
  percentageNum(partialValue, totalValue) {
    return (partialValue * 100) / totalValue;
  },
  numToFixed(num, point) {
    if (!point) point = 2;
    return num.toFixed(point);
  },
  transformSecond(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  },
  removingUndefined(obj) {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
  },
  isEmail: async (value) => {
    const reg = /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/;
    return reg.test(value);
  },
  getArraySize: async (list, key) => {
    let newArray = [];
    list.forEach((element) => {
      newArray.push(element[`${key}`]);
    });
    return newArray;
  },

  checkSrcVoiceFIleService: (nameString) => {
    const isEnglish = ENGLISH[nameString.substring(0, 1)];
    const isNumber = NUMBERS[nameString.substring(0, 1)];
    if (isEnglish) {
      return 'genesis';
    } else if (isNumber) {
      return 'cloudee';
    } else {
      return false;
    }
  },

  subStringForEmail: (nameFile) => {
    const stringArray = nameFile.split('_');
    const preEmail = stringArray.shift();
    const bikEmail = `${preEmail.toLowerCase()}@bitkub.com`;
    return bikEmail;
  },

  subStringForAgentNumber: (nameFile) => {
    const stringArray = nameFile.split('_');
    if (stringArray.length > 2) {
      const agentNumber = stringArray[2];
      return `${agentNumber.toString().padStart(6, '0')}`;
    }
    return '';
  },

  convertDateToStringFormat: (unixTime) => {
    return `${moment.unix(unixTime).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')}`;
  },

  convertDateToDateFormat: (unixTime) => {
    return `${moment.unix(unixTime).tz('Asia/Bangkok').format('YYYY-MM-DD')}`;
  },

  dynamicSort: (arrays, field) => {
    return arrays.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));
  },
  shuffleArray: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  },
  maxValueInArray: (array, key) => {
    return array.reduce((prev, current) => (prev[key] > current[key] ? prev : current));
  },
  minValueInArray: (array, key) => {
    return array.reduce((prev, current) => (prev[key] < current[key] ? prev : current));
  },
  calAvgValueInArray: (array, key) => {
    return parseFloat(array.reduce((total, next) => total + next[key], 0) / array.length).toFixed(2);
  },
  getListFilterForHC: (startedDate) => {
    const arrayListTime = [
      { start: '09:00:00', end: '10:00:00' },
      { start: '10:00:00', end: '11:00:00' },
      { start: '11:00:00', end: '12:00:00' },
      { start: '12:00:00', end: '13:00:00' },
      { start: '13:00:00', end: '14:00:00' },
      { start: '14:00:00', end: '15:00:00' },
      { start: '15:00:00', end: '16:00:00' },
      { start: '16:00:00', end: '17:00:00' },
      { start: '17:00:00', end: '18:00:00' },
      { start: '18:00:00', end: '19:00:00' },
      { start: '19:00:00', end: '20:00:00' },
    ];
    const arrayReturn = [];
    for (const objLength of arrayListTime) {
      const inLenStartedTime = moment(`${startedDate} ${objLength['start']}`).tz('Asia/Bangkok').unix();
      const inLenEndedTime = moment(`${startedDate} ${objLength['end']}`).tz('Asia/Bangkok').unix();
      const objTime = {
        startedFormat: objLength['start'],
        endedFormat: objLength['end'],
        startedUnix: inLenStartedTime,
        endedUnix: inLenEndedTime,
      };
      arrayReturn.push(objTime);
    }
    return arrayReturn;
  },
  getOnlyInLeft: async (arrA, arrB) => {
    return arrA.filter(({ email: emailA }) => !arrB.some(({ email: emailB }) => emailB === emailA));
  },
  getKeyOfObject,
  StringifyCustom,
  SubString,
};
