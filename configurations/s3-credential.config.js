const configAwsConfig = JSON.parse('{}');

configAwsConfig['AWSApiVersion'] = process.env.AWS_API_VERSION;
configAwsConfig['AWSAccessKeyId'] = process.env.AWS_ACCESS_KEY_ID;
configAwsConfig['AWSSecretKey'] = process.env.AWS_SECRET_KEY;
configAwsConfig['AWSRegion'] = process.env.AWS_S3_REGION;
configAwsConfig['AWSBucket'] = process.env.AWS_BUCKET_NAME;

module.exports = configAwsConfig;
