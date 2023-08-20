const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const auditlogsController = require(path.resolve(`${dirname}/src/controllers/auditlogs.controller.js`));
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = auditlogsController({
  auditlogRepository: AuditlogRepository,
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod GET', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'getAll').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).get('/');
    expect(response.statusCode).toEqual(500);
  });
});

describe('Test on medthod POST', () => {
  test('return status code 200', async () => {
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Get success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/');
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500', async () => {
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/');
    expect(response.statusCode).toEqual(500);
  });
});
