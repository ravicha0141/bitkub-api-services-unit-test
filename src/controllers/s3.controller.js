const express = require('express');
const multer = require('multer');
const upload = multer();
const { uploadImageFile, uploadAudioFile, fileFilterImage, fileFilterAudioFile } = require('../services/s3.service');
const { ErrorSetOfS3Storage } = require('../constants/error-sets');
const { LoggerServices } = require('../logger');
const { dataForUploadFileDTO, createAttachmentFileDTO } = require('../dto/storage-file');
const serviceName = 's3-storage';

const S3storageController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { attachmentRepository } = options;

  router.post('/profile-picture/upload', upload.single('image'), async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const fileData = req.file;
      if (typeof fileData === 'undefined') {
        logger.error('upload-profile-picture error.', ErrorSetOfS3Storage.BIQ_SSS_02);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_02);
      }
      const { mimetype } = fileData;
      if (!fileFilterImage(mimetype)) {
        logger.error('mimetype-not-allow error.', ErrorSetOfS3Storage.BIQ_SSS_03);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_03);
      }
      const fileUpdated = await uploadImageFile(dataForUploadFileDTO(fileData), 'images/profilePicture');
      if (!fileUpdated) {
        const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_01 };
        logger.error('upload-profile-picture error.', { ...errorObject, debugMessage: fileUpdated?.message });
        return res.status(400).json(errorObject);
      }
      const fileUploadedDetail = createAttachmentFileDTO({ ...fileData, ...fileUpdated });
      logger.debug('fileUploadedDetail', fileUploadedDetail);
      const createdStorageFile = await attachmentRepository.createStorageFiles(fileUploadedDetail, `profile-picture`);
      logger.debug('createdStorageFile', createdStorageFile);
      logger.info('upload-profile-picture completed.');
      return res.status(200).json(createdStorageFile);
    } catch (error) {
      const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_00 };
      logger.critical(ErrorSetOfS3Storage.BIQ_SSS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/signature/upload', upload.single('image'), async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const fileData = req.file;
      if (typeof fileData === 'undefined') {
        logger.error('upload-signature error.', ErrorSetOfS3Storage.BIQ_SSS_02);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_02);
      }
      const { mimetype } = fileData;
      if (!fileFilterImage(mimetype)) {
        logger.error('mimetype-not-allow error.', ErrorSetOfS3Storage.BIQ_SSS_03);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_03);
      }
      const fileUpdated = await uploadImageFile(dataForUploadFileDTO(fileData), 'images/signature');
      if (!fileUpdated) {
        const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_01 };
        logger.error('upload-signature error.', { ...errorObject, debugMessage: fileUpdated?.message });
        return res.status(400).json(errorObject);
      }
      const fileUploadedDetail = createAttachmentFileDTO({ ...fileData, ...fileUpdated });
      logger.debug('fileUploadedDetail', fileUploadedDetail);
      const createdStorageFile = await attachmentRepository.createStorageFiles(fileUploadedDetail, `signature`);
      logger.debug('createdStorageFile', createdStorageFile);
      logger.info('upload-signature completed.');
      return res.status(200).json(createdStorageFile);
    } catch (error) {
      const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_00 };
      logger.critical(ErrorSetOfS3Storage.BIQ_SSS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/voices/upload', upload.single('audio'), async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const fileData = req.file;
      if (typeof fileData === 'undefined') {
        logger.error('upload-voice error.', ErrorSetOfS3Storage.BIQ_SSS_02);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_02);
      }
      const { mimetype } = fileData;
      if (!fileFilterAudioFile(mimetype)) {
        logger.error('mimetype-not-allow error.', ErrorSetOfS3Storage.BIQ_SSS_04);
        return res.status(400).json(ErrorSetOfS3Storage.BIQ_SSS_04);
      }
      const fileUpdated = await uploadAudioFile(dataForUploadFileDTO(fileData));
      if (!fileUpdated) {
        const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_01 };
        logger.error('upload-voice error.', { ...errorObject, debugMessage: fileUpdated?.message });
        return res.status(400).json(errorObject);
      }
      const fileUploadedDetail = createAttachmentFileDTO({ ...fileData, ...fileUpdated });
      logger.debug('fileUploadedDetail', fileUploadedDetail);
      const createdStorageFile = await attachmentRepository.createStorageFiles(fileUploadedDetail, 'voice-file');
      logger.debug('createdStorageFile', createdStorageFile);
      logger.info('upload-voice completed.');
      return res.status(200).json(createdStorageFile);
    } catch (error) {
      const errorObject = { ...ErrorSetOfS3Storage.BIQ_SSS_00 };
      logger.critical(ErrorSetOfS3Storage.BIQ_SSS_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = S3storageController;
