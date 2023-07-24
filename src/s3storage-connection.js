const aws = require('aws-sdk');
const configAwsConfig = require('../configurations/s3-credential.config');

aws.config.update({
  apiVersion: configAwsConfig.AWSApiVersion,
  accessKeyId: configAwsConfig.AWSAccessKeyId,
  secretAccessKey: configAwsConfig.AWSSecretKey,
  region: configAwsConfig.AWSRegion,
});

const s3Service = new aws.S3();
const sesService = new aws.SES();
module.exports = {
  s3Service,
  sesService,
};
