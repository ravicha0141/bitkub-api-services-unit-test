const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const s3storageController = require(path.resolve(`${dirname}/src/controllers/s3.controller.js`));
const { s3Service } = require(path.resolve(`${dirname}/src/s3storage-connection`));
const AttachmentRepository = new repositoriesDb.attachmentRepository();
// const UploadImageFile = new s3Service.uploadImageFile();
// const UploadAudioFile = new uploadAudioFile();
// const FileFilterImage = new fileFilterImage();
// const FileFilterAudioFile = new fileFilterAudioFile();
let router = s3storageController({
  attachmentRepository: AttachmentRepository,
  // UploadImageFile: UploadImageFile,
  // uploadAudioFile: UploadAudioFile,
  // fileFilterImage: FileFilterImage,
  // fileFilterAudioFile: FileFilterAudioFile,
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
app.use('/', router);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod POST /profile-picture/upload', () => {
  /* const mockReqInvalidType = {
    file: 'undefined',
  };
  const mockReqWrongType = {
    file: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    size: 3202408,
  };
  const mockReq = {
    __v: 0,
    _id: '630d0ef3806854eff19955a1',
    bucket: 'bitqast-dev',
    createdAt: 1671723166,
    etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
    fieldname: 'audio',
    fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    originalname: 'Test voice file small 1 copy 2.mp3',
    size: 3202408,
    sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    typeFile: 'voice-file',
    updatedAt: null,
    file: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  }; */
  test('return status code 400, upload failure, file is null', async () => {
    const response = await request(app).post('/profile-picture/upload');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with mimetype-not-allow', async () => {
    const mockReqFile = {
      mimetype: 'image/jpeg-wrong'
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    const response = await request(app).post('/profile-picture/upload');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with upload-profile-picture error', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, false);
    });
    const response = await request(app).post('/profile-picture/upload');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).post('/profile-picture/upload');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    const response = await request(app).post('/profile-picture/upload');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /signature/upload', () => {
  const endPoint = '/signature/upload';
  test('return status code 400, upload failure, file is undefined', async () => {
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with mimetype-not-allow', async () => {
    const mockReqFile = {
      mimetype: 'image/jpeg-wrong'
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with upload-signature error', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, false);
    });
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    const mockReqFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST /voices/upload', () => {
  const endPoint = '/voices/upload';
  test('return status code 400, upload failure, file is undefined', async () => {
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with mimetype-not-allow', async () => {
    const mockReqFile = {
      mimetype: 'image/jpeg-wrong'
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400 with upload-signature error', async () => {
    const mockReqFile = {
      originalname: 'test.mp3',
      mimetype: 'audio/mp3',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, false);
    });
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    const mockReqFile = {
      originalname: 'test.mp3',
      mimetype: 'audio/mp3',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.resolve(true);
    });
    let response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    const mockReqFile = {
      originalname: 'test.mp3',
      mimetype: 'audio/mp3',
      buffer: 200
    };
    const app = express();
    app.use((req, res, next) => {
      req.file = mockReqFile;
      next();
    });
    app.use('/', router);

    const mockReqFileUpdated = {
      Key: 'testKey',
      location: '',
      uri: '',
      fieldname: '',
      size: 200,
      bucket: '',
      etag: 'testEtag'
    };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      callback(null, mockReqFileUpdated);
    });
    jest.spyOn(await AttachmentRepository, 'createStorageFiles').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    const response = await request(app).post(endPoint);
    expect(response.statusCode).toEqual(500);
  });
});
