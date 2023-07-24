const express = require('express');
const multer = require('multer');
const { ErrorSetOfEmail } = require(`../constants/error-sets`);
const { sendResultEvaluateEmail } = require(`../services/ses.service.js`);
const { resultEvaluateMailValidator } = require('../validator/email/email.validator');
const { LoggerServices } = require('../logger');

const serviceName = 'email';
const upload = multer({ storage: multer.memoryStorage() });

const EmailController = () => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  router.post('/result-evaluate', upload.array('attachments'), async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const attachments = Array.isArray(req.files)
        ? req.files.map((file) => {
            return {
              filename: file.originalname,
              content: file.buffer,
            };
          })
        : [];
      logger.debug('send-email-result-evaluate', { payload: req.body, files: attachments });
      const checkValidateData = resultEvaluateMailValidator(req.body);
      if (!checkValidateData) {
        const errorObject = { ...ErrorSetOfEmail.BIQ_EML_01, validateErrorList: resultEvaluateMailValidator.errors };
        logger.error('send-email-result-evaluate validate-error', { ...errorObject, debugMessage: resultEvaluateMailValidator.errors });
        return res.status(400).json(errorObject);
      }
      const { sendTo, ccSendTo } = req.body;
      sendResultEvaluateEmail({ sendTo, ccSendTo, attachments }).catch((error) => {
        if (error) {
          logger.error('send-email-result-evaluate error', { error });
        } else {
          logger.debug('Email send completed');
        }
      });
      res.status(200).json({ message: 'Email will send in few minutes!' });
      logger.info(`send-email-result-evaluate completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfEmail.BIQ_EML_00 };
      logger.critical(ErrorSetOfEmail.BIQ_EML_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = EmailController;
