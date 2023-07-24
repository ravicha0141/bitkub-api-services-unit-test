const express = require('express');
const { ErrorSetOfAuditlog } = require('../constants/error-sets');
const { LoggerServices } = require('../logger');
const serviceName = 'auditlogs';

const AuditlogsController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { auditlogRepository } = options;

  router.get('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-list-auditlogs', { query: req.query });
      const progressionList = await auditlogRepository.getAll(req.query);

      logger.debug('response data', { length: progressionList.length, sample: progressionList.slice(0, 2) });
      res.status(200).json(progressionList);
      logger.info('get-list-auditlogs completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfAuditlog.BIQ_ADL_00 };
      logger.critical(ErrorSetOfAuditlog.BIQ_ADL_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.post('/', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('create-auditlog', { payload: req.body });
      const auditlogCreated = await auditlogRepository.create(req.body);

      logger.debug('response data', auditlogCreated);
      res.status(200).json(auditlogCreated);
      logger.info('create-auditlog completed.');
    } catch (error) {
      const errorObject = { ...ErrorSetOfAuditlog.BIQ_ADL_00 };
      logger.critical(ErrorSetOfAuditlog.BIQ_ADL_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.delete('/:auditlogId', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const { auditlogId } = req.params;
      logger.debug('remove-auditlog', auditlogId);
      const auditlogCreated = await auditlogRepository.deleteOne(auditlogId);
      logger.debug('response removed data', auditlogCreated);
      res.status(200).json(auditlogCreated);
      logger.info('auditlog-removed completed.');
    } catch (error) {
      console.log('error', error);
      const errorObject = { ...ErrorSetOfAuditlog.BIQ_ADL_00 };
      logger.critical(ErrorSetOfAuditlog.BIQ_ADL_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = AuditlogsController;
