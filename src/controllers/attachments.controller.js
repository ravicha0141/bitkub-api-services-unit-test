const express = require('express');
const { getSignedUrl } = require('../services/s3.service');
const { ErrorSetOfFile } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const serviceName = 'attachments';

const AttachmentController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { attachmentRepository } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-attachment', { query: req.query });
      const listOfFiles = await attachmentRepository.getStorageFiles(req.query);
      logger.debug('response data', { length: listOfFiles.length, sample: listOfFiles.slice(0, 2) });
      res.status(200).json(listOfFiles);
      logger.info(`get-list-attachment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfFile.FILE_GET_00 };
      logger.critical(ErrorSetOfFile.FILE_GET_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/:fileId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-attachment', { params: req.params });
      const fileData = await attachmentRepository.getStorageFileById(req.params.fileId);
      if (!fileData) {
        logger.error(`get-attachment error.`, ErrorSetOfFile.FILE_GET_01);
        return res.status(400).json(ErrorSetOfFile.FILE_GET_01);
      }
      const signedUrl = await getSignedUrl(fileData);

      logger.debug('response data', { fileData, signedUrl });
      res.status(200).json({ ...fileData, signedUrl });
      logger.info(`get-attachment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfFile.FILE_GET_00 };
      logger.critical(ErrorSetOfFile.FILE_GET_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:fileId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('delete-attachment', { params: req.params });
      const { fileId } = req.params;
      const fileData = await attachmentRepository.getStorageFileById(fileId);
      if (!fileData) {
        logger.error(`delete-attachment error.`, ErrorSetOfFile.FILE_GET_01);
        return res.status(400).json(ErrorSetOfFile.FILE_GET_01);
      }
      const fileRemoved = await attachmentRepository.removeFileById(fileId);

      logger.debug('response data', fileRemoved);
      res.status(200).json(fileRemoved);
      logger.info(`delete-attachment completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfFile.FILE_GET_00 };
      logger.critical(ErrorSetOfFile.FILE_GET_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = AttachmentController;
