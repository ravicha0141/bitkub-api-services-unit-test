const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const s3storageController = require(path.resolve(`${dirname}/src/controllers/s3.controller.js`));
const s3Service = require(path.resolve(`${dirname}/src/services/s3.service`));
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


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod POST /profile-picture/upload', () => {
  let mockReqInvalidType = {
    file: 'undefined',
  };
  let mockReqWrongType = {
    file: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    size: 3202408,
  };
  let mockReq = {
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
  };
  test('return status code 400, upload failure, file is null', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/profile-picture/upload').send(mockReqInvalidType);
    expect(response.statusCode).toEqual(400);
  });
  // test('return status code 400, fail upload profile picture error', async () => {
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).post('/profile-picture/upload').send(mockReq);
  //   expect(response.statusCode).toEqual(400);
  // });
  // test('return status code 400, Invalid mime type, only JPEG and PNG', async () => {
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).post('/profile-picture/upload');
  //   expect(response.statusCode).toEqual(400);
  // });
  // test('return status code 400, s3 storage service was wrong', async () => {
  //   jest.spyOn(await s3Service, 'uploadImageFile').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).post('/profile-picture/upload').send(mockReq);
  //   expect(response.statusCode).toEqual(400);
  // });
});

describe('Test on medthod POST /voices/upload', () => {
  test('return status code 400, fail upload voice file error', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/voices/upload');
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test on medthod POST /signature/upload', () => {
  test('return status code 400, fail upload signature file error', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signature/upload');
    expect(response.statusCode).toEqual(400);
  });
});
