const path = require('path');
const __dir = require('app-root-path');
let appConfig;
describe('sendResultEvaluateEmail', () => {
  beforeEach(() => {
    appConfig = require(path.resolve(`${__dir}/configurations`));
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  test('should send email successfully', async () => {
    jest.mock('nodemailer', () => {
      return {
        createTransport: jest.fn(() => ({
          verify: jest.fn((callback) => {
            callback(null, 'Success');
          }),
          sendMail: jest.fn().mockImplementationOnce((mailOption, callback) => {
            callback(null , { envelope: 'mockEnvelope' });
          })
        }))
      };
    });
    appConfig.emailSender = 'test@bitkub.com';
    const mockAttachments = [
      { filename: 'test.txt', content: 'test' }
    ];
    const { sendResultEvaluateEmail } = require(path.resolve(`${__dir}/src/services/ses.service`));
    const result = await sendResultEvaluateEmail({
      sendTo: 'test@bitkub.com',
      ccSendTo: 'cc@bitkub.com',
      attachments: mockAttachments,
    });
    expect(result).toEqual('mockEnvelope');
  });
  test('should reject when emailSender has no value', async () => {
    jest.mock('nodemailer', () => {
      return {
        createTransport: jest.fn(() => ({
          verify: jest.fn((callback) => {
            callback(null, 'Success');
          })
        }))
      };
    });
    appConfig.emailSender = false;
    const mockAttachments = [
      { filename: 'test.txt', content: 'test' }
    ];
    const { sendResultEvaluateEmail } = require(path.resolve(`${__dir}/src/services/ses.service`));
    try{
      const result = await sendResultEvaluateEmail({
        sendTo: 'test@bitkub.com',
        ccSendTo: 'cc@bitkub.com',
        attachments: mockAttachments,
      });
    } catch(error){
      expect(error).toHaveProperty('message');
    }
  });
  test('should reject when sendMail error', async () => {
    jest.mock('nodemailer', () => {
      return {
        createTransport: jest.fn(() => ({
          verify: jest.fn((callback) => {
            callback(null, 'Success');
          }),
          sendMail: jest.fn().mockImplementationOnce((mailOption, callback) => {
            callback(true, null);
          })
        }))
      };
    });
    appConfig.emailSender = 'test@bitkub.com';
    const mockAttachments = [
      { filename: 'test.txt', content: 'test' }
    ];
    const { sendResultEvaluateEmail } = require(path.resolve(`${__dir}/src/services/ses.service`));
    try{
      const result = await sendResultEvaluateEmail({
        sendTo: 'test@bitkub.com',
        ccSendTo: 'cc@bitkub.com',
        attachments: mockAttachments,
      });
    } catch(error){
      expect(error).toBe(true);
    }
  });
});