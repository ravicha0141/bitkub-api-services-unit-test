const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const emailController = require(path.resolve(`${dirname}/src/controllers/email.controller.js`));
let router = emailController({});


describe('Test on medthod POST /result-evaluate', () => {
  test('return status code 400, filter disputes was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/result-evaluate').send('');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      sendTo: 'agentqa01@bitkub.com',
      ccSendTo: 'assisttest01@bitkub.com',
    };
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/result-evaluate').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500, Email internal service error', async () => {
    const { LoggerServices } = require(path.resolve(`${dirname}/src/logger`));
    const mockLoggerDebug = jest.spyOn(LoggerServices.prototype, 'debug').mockImplementation(() => {
      throw new Error('Debug error');
    });
    const mockReq = {
      sendTo: 'agentqa01@bitkub.com',
      ccSendTo: 'assisttest01@bitkub.com',
      files: [],
    };
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', router);
    const response = await request(app).post('/result-evaluate').send(mockReq);
    expect(response.status).toBe(500);
    mockLoggerDebug.mockRestore();
  });

});
