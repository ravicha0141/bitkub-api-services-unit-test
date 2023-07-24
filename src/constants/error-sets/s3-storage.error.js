const errorSetOfS3Storage = {
  BIQ_SSS_00: {
    errorCode: 'BIQ-SSS-00',
    errorMessage: 's3 storage controller error something.',
  },
  BIQ_SSS_01: {
    errorCode: 'BIQ-SSS-01',
    errorMessage: 's3 storage service was wrong.',
  },
  BIQ_SSS_02: {
    errorCode: 'BIQ-SSS-02',
    errorMessage: 'upload failure, file is null.',
  },
  BIQ_SSS_03: {
    errorCode: 'BIQ-SSS-03',
    errorMessage: 'Invalid mime type, only JPEG and PNG',
  },
  BIQ_SSS_04: {
    errorCode: 'BIQ-SSS-04',
    errorMessage: 'Invalid mime type, only mp3,mpeg andwav',
  },
};

module.exports = errorSetOfS3Storage;
