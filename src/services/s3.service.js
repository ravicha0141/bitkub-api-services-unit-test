const moment = require('moment-timezone');
const { v4: uuid } = require('uuid');
const configAwsConfig = require('../../configurations/s3-credential.config');
const { s3Service } = require('../s3storage-connection');

const fileFilterImage = (mimetype) => {
  const allowList = ['image/jpeg', 'image/png'];
  return allowList.includes(mimetype);
};

const fileFilterAudioFile = (mimetype) => {
  const allowList = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave'];
  return allowList.includes(mimetype);
};

const getSignedUrl = async ({ bucket, key, expires }) => {
  try {
    const signedUrl = s3Service.getSignedUrl('getObject', {
      Key: key,
      Bucket: bucket,
      Expires: expires || 900,
    });
    return signedUrl;
  } catch (error) {
    return null;
  }
};

const uploadImageFile = async (fileData, fileType) => {
  const { originalname } = fileData;
  const index = originalname.lastIndexOf('.');
  const fileName = originalname.substring(0, index);
  const fileTypeName = originalname.substring(index, originalname.length);
  const locationFile = `${fileType}/bitqast-${uuid()}_${fileName + fileTypeName}`;

  const params = {
    Bucket: configAwsConfig.AWSBucket,
    Key: locationFile,
    Body: fileData.buffer,
    ContentType: fileData.mimetype,
  };
  return new Promise((resolve, reject) => {
    s3Service.upload(params, async (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const uploadAudioFile = async (fileData) => {
  const { originalname } = fileData;
  const location = `voices/${moment().tz('Asia/Bangkok').format('YYYY-MM-DD')}`;
  const index = originalname.lastIndexOf('.');
  const fileName = originalname.substring(0, index);
  const fileTypeName = originalname.substring(index, originalname.length);
  const locationFile = `${location}/bitqast-${uuid()}_${fileName + fileTypeName}`;
  const params = {
    Bucket: configAwsConfig.AWSBucket,
    Key: locationFile,
    Body: fileData.buffer,
    ContentType: fileData.mimetype,
  };
  return new Promise((resolve, reject) => {
    s3Service.upload(params, async (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = {
  getSignedUrl,
  uploadImageFile,
  uploadAudioFile,
  fileFilterImage,
  fileFilterAudioFile,
};
