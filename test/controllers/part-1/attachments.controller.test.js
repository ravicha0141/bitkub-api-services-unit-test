const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const attachmentController = require(path.resolve(`${dirname}/src/controllers/attachments.controller.js`));
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = attachmentController({
  attachmentRepository: AttachmentRepository,
  auditlogRepository: AuditlogRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFiles').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, attachments controller error something', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFiles').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod GET /:fileId', () => {
  test('return status code 400, File not found', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:fileId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:fileId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, attachments controller error something', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFiles').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/:fileId');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod DELETE /:fileId', () => {
  test('return status code 400, assignment not found', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:fileId');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AttachmentRepository, 'removeFileById').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:fileId');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, attachments controller error something', async () => {
    jest.spyOn(await AttachmentRepository, 'getStorageFileById').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).delete('/:assignmentId');
    expect(response.statusCode).toEqual(500);
  });
});
