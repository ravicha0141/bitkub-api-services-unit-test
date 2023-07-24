require('dotenv').config;
const path = require('path');
const __dir = require('app-root-path');
const appConfig = require('../../configurations');
const { sesService } = require(path.resolve(`${__dir}/src/s3storage-connection`));
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

const transporter = nodemailer.createTransport({
  SES: sesService,
});

// eslint-disable-next-line
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server email has connected to AWS SES.');
  }
});

/**
 *
 * @param {{sendTo:string, ccSendTo:string, subject:string, attachments:{filename: String, content: Buffer}[]}} .
 *
 * sendTo - The email address you want to send.
 * ccSendTo - The email address you want to send cc.
 * subject - The subject of your email.
 * attachments - The attachment list of {filename: String, content: Buffer}
 *
 * This function return promise
 */
const sendResultEvaluateEmail = async ({ sendTo, ccSendTo, attachments = [] }) => {
  // create Nodemailer SES transporter

  const mailOption = {
    from: appConfig.emailSender,
    to: sendTo,
    cc: ccSendTo,
    subject: 'Evaluation of Result on ' + moment().format('DD/MM/YYYY'),
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
        .card {
          min-width: 0;
          word-wrap: break-word;
          background-color: #ffffff;
          background-clip: border-box;
          border: 1px solid #ebedf3;
          border-radius: 0.42rem;
        }
        .center {
          margin: 1rem auto;
          width: 75%;
          padding: 10px;
        }
      </style>
    </head>
    <body style="text-align: left; background: #eaf1f7; color: #3f4254">
      <div class="center" style="max-width: 600px; min-width: 400px">
        <div class="card" style="padding: 0rem 0.5rem">
          <div class="center">
            <img
              alt="Logo"
              src="https://www.bitkub.com/static/images/Bitkub-Thailand-Cryptocurrency-Bitcoin-Exchange.jpg"
              style="width: 100%"
            />
          </div>
          <div style="padding: 0rem 1rem">
            <p>Dear associate;</p>
            <p>Your evaluation results are ready. Please see the attachments for more details.</p>
            <p>Thank you and regards,</p>
            <p>QA team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `,
    attachments: attachments,
  };

  return new Promise((resolve, reject) => {
    if (!appConfig.emailSender) reject({ message: 'Email sender not found' });
    else {
      transporter.sendMail(mailOption, (error, info) => {
        console.log('sendmail', error, info);
        if (error) reject(error);
        else resolve(info?.envelope);
      });
    }
  });
};

module.exports = { sendResultEvaluateEmail };
