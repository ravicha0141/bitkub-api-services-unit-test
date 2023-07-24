const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ strictTypes: true, allowUnionTypes: true });
const { isValidObjectId } = require('mongoose');

ajv.addKeyword({
  keyword: 'isBitkubSite',
  validate: (schema, data) => {
    return schema && typeof ['bitkub.com', 'gmail.com'].find((mail) => mail === data.split('@')[1]) !== 'undefined' ? true : false;
  },
});
ajv.addKeyword({
  keyword: 'isEngTextWithWhiteSpace',
  validate: (schema, text) => {
    let arrEngList = {};
    let strAllowed = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `;
    strAllowed.split('').forEach((ch) => {
      arrEngList[ch] = true;
    });
    let index;
    for (index = text.length - 1; index >= 0; --index) {
      if (!arrEngList[text.substring(index, index + 1)]) {
        return false;
      }
    }
    return true;
  },
});
ajv.addKeyword({
  keyword: 'isEngTextAndAllowedCharacterOnly',
  validate: (schema, text) => {
    let arrEngList = {};
    let strAllowed = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.`;
    strAllowed.split('').forEach((ch) => {
      arrEngList[ch] = true;
    });
    let index;
    for (index = text.length - 1; index >= 0; --index) {
      if (!arrEngList[text.substring(index, index + 1)]) {
        return false;
      }
    }
    return true;
  },
});
ajv.addKeyword({
  keyword: 'isAllowedCharacterPassword',
  validate: (schema, text) => {
    let arrEngList = {};
    let strAllowed = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(!@#$%^&*()_+|~-=\`{}[]:";'<>?,./) `;
    strAllowed.split('').forEach((ch) => {
      arrEngList[ch] = true;
    });
    let index;
    for (index = text.length - 1; index >= 0; --index) if (!arrEngList[text.substring(index, index + 1)]) return false;
    return true;
  },
});
ajv.addKeyword({
  keyword: 'mongoObjectId',
  validate: (schema, text) => {
    return String(schema) === 'true' && isValidObjectId(text);
  },
  error: {
    message: 'value must be mongo object id',
  },
});

addFormats(ajv);
module.exports = ajv;
