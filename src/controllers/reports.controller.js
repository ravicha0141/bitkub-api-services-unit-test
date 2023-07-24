const express = require('express');
const moment = require('moment-timezone');
const { ErrorSetOfReports } = require('../constants/error-sets');
const { TrackTypeEnum } = require('../constants/forms/track-type.constants');

const {
  ReportOfBadAnalysisFilterTypeOne,
  ReportOfBadAnalysisFilterTypeTwo,
  ReportOfBadAnalysisFilterTypeThere,
} = require('../validator/reports/bad-analysis.validator');

const {
  ReportOfAgentAndTeamPerfFilter,
  ReportOfQaTeamPerformanceFilter,
  ReportOfQaTeamPerformanceDateCustomFilter,
  ReportOfQaAgentPerformanceFilter,
} = require('../validator/reports/agent-and-team-perf.validator');

const { ReportOfCompliantAndNoncompliantFilter } = require('../validator/reports/compliant-and-noncompliant.validator');
const { ReportOfVarianceFilter } = require('../validator/reports/variances.validator');
const { ReportOfDisputeCollectingFilter } = require('../validator/reports/dispute-collecting.validator');
const { ReportOfFeedbackFilter } = require('../validator/reports/feedback.validator');
const { LoggerServices } = require('../logger');

const serviceName = 'reports';

const ReportController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  const {
    criteriaQaCsRepository,
    reportBadAnalysisRepository,
    reportAgentAndTeamPerfRepository,
    reportCompliantAndNoncompliantRepository,
    reportOfVarianceWithKycUseCase,
    criteriaKycRepository,
    reportOfDisputeCollectingUseCase,
    reportOfFeedbackUseCase,
  } = options;

  router.get('/bad-analysis/views/total-bad-analysis', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-bad-analysis', { view: 'total-bad-analysis', query: req.query });
      const validated = ReportOfBadAnalysisFilterTypeOne(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfBadAnalysisFilterTypeOne.errors };
        logger.error('get-report-bad-analysis validate-error', { ...errorObject, debugMessage: ReportOfBadAnalysisFilterTypeOne.errors });
        return res.status(400).json(errorObject);
      }

      const { formId, frequency, team, groupId } = req.query;
      const reportFilter = { badAnalysisId: formId };
      if (team === 'TEAM') reportFilter.groupId = groupId;
      logger.debug('bad analysis report filter', reportFilter);

      const returnData = await reportBadAnalysisRepository.getReportTotalBad(frequency, reportFilter);

      logger.info(`get-report-bad-analysis completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/bad-analysis/views/team-bad-analysis', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-bad-analysis', { view: 'team-bad-analysis', query: req.query });
      const validated = ReportOfBadAnalysisFilterTypeTwo(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfBadAnalysisFilterTypeTwo.errors };
        logger.error('get-report-bad-analysis validate-error', { ...errorObject, debugMessage: ReportOfBadAnalysisFilterTypeTwo.errors });
        return res.status(400).json(errorObject);
      }
      const { formId, startDate, endDate } = req.query;
      const dateStart = moment(startDate, 'DD/MM/YYYY').unix();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').unix();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-bad-analysis error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      const reportFilter = {
        badAnalysisId: formId,
        createdAt: {
          $gte: dateStart,
          $lt: dateStop,
        },
      };
      logger.debug('bad analysis report filter', reportFilter);

      const returnData = await reportBadAnalysisRepository.getReportTeamBad(reportFilter);

      logger.info(`get-report-bad-analysis completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/bad-analysis/views/agent-bad-analysis', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-bad-analysis', { view: 'agent-bad-analysis', query: req.query });
      const validated = ReportOfBadAnalysisFilterTypeThere(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfBadAnalysisFilterTypeThere.errors };
        logger.error('get-report-bad-analysis validate-error', { ...errorObject, debugMessage: ReportOfBadAnalysisFilterTypeThere.errors });
        return res.status(400).json(errorObject);
      }
      const { formId, frequency, groupId, reasonForBad } = req.query;
      const reportFilter = {
        badAnalysisId: formId,
        'reasonForBad.referId': reasonForBad,
      };
      if (groupId) reportFilter.groupId = groupId;
      logger.debug('bad analysis report filter', reportFilter);

      const returnData = await reportBadAnalysisRepository.getReportAgentBad(frequency, reportFilter);

      logger.info(`get-report-bad-analysis completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/agent-and-team-performance', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-agent-and-team-performance', { query: req.query });
      const validated = ReportOfAgentAndTeamPerfFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfAgentAndTeamPerfFilter.errors };
        logger.error('get-report-agent-and-team-performance validate-error', {
          ...errorObject,
          debugMessage: ReportOfAgentAndTeamPerfFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, groupId, startDate, endDate, agentId } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').toDate();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-agent-and-team-performance error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      let returnData = { reportHeaders: [], reportData: [] };
      const reportFilter = {
        trackType,
        formId,
        status: 'completed',
        completedDate: {
          $gte: dateStart,
          $lt: dateStop,
        },
      };

      if (groupId) reportFilter.groupId = groupId;
      if (agentId) {
        reportFilter.agentId = agentId;
        logger.debug('agent and team performance report filter', reportFilter);
        if (trackType == TrackTypeEnum.KYC) {
          returnData = await reportAgentAndTeamPerfRepository.getReportCriteriaKycByAgent(reportFilter);
        } else {
          returnData = await reportAgentAndTeamPerfRepository.getReportCriteriaQaCsByAgent(reportFilter);
        }
      } else {
        logger.debug('agent and team performance report filter', reportFilter);
        if (trackType == TrackTypeEnum.KYC) {
          returnData = await reportAgentAndTeamPerfRepository.getReportCriteriaKycByTeam(reportFilter);
        } else {
          returnData = await reportAgentAndTeamPerfRepository.getReportCriteriaQaCsByTeam(reportFilter);
        }
      }

      logger.info(`get-report-agent-and-team-performance completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/qa-performance-by-team/all-date', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-qa-performance-by-team', { view: 'all-date', query: req.query });
      const validated = ReportOfQaTeamPerformanceFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfQaTeamPerformanceFilter.errors };
        logger.error('get-report-qa-performance-by-team validate-error', {
          ...errorObject,
          debugMessage: ReportOfQaTeamPerformanceFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, groupId, qaAgentId, view } = req.query;

      const reportFilter = {
        trackType,
        formId,
        status: 'completed',
      };
      if (groupId) reportFilter.groupId = groupId;
      if (qaAgentId) reportFilter.qaAgentId = qaAgentId;
      logger.debug('qa performance by team report filter', reportFilter);

      const returnData = await reportAgentAndTeamPerfRepository.getReportQaPerformanceByTeam(view, reportFilter);

      logger.info(`get-report-qa-performance-by-team completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;

      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/qa-performance-by-team/custom-date', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-qa-performance-by-team', { view: 'custom-date', query: req.query });
      const validated = ReportOfQaTeamPerformanceDateCustomFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfQaTeamPerformanceDateCustomFilter.errors };
        logger.error('get-report-qa-performance-by-team validate-error', {
          ...errorObject,
          debugMessage: ReportOfQaTeamPerformanceDateCustomFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, groupId, qaAgentId, startDate, endDate } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').toDate();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-qa-performance-by-team error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      const reportFilter = {
        trackType,
        formId,
        status: 'completed',
        completedDate: {
          $gte: dateStart,
          $lt: dateStop,
        },
      };
      if (groupId) reportFilter.groupId = groupId;
      if (qaAgentId) reportFilter.qaAgentId = qaAgentId;
      logger.debug('qa performance by team report filter', reportFilter);

      const returnData = await reportAgentAndTeamPerfRepository.getReportQaPerformanceByTeamDateCustom(reportFilter);

      logger.info(`get-report-qa-performance-by-team completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/qa-performance-by-agent/custom-date', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-qa-performance-by-agent', { view: 'custom-date', query: req.query });
      const validated = ReportOfQaAgentPerformanceFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfQaAgentPerformanceFilter.errors };
        logger.error('get-report-qa-performance-by-agent validate-error', {
          ...errorObject,
          debugMessage: ReportOfQaAgentPerformanceFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, groupId, qaAgentId, startDate, endDate } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').toDate();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-qa-performance-by-agent error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      const reportFilter = {
        trackType,
        formId,
        status: 'completed',
        completedDate: {
          $gte: dateStart,
          $lt: dateStop,
        },
      };
      if (groupId) reportFilter.groupId = groupId;
      if (qaAgentId) reportFilter.qaAgentId = qaAgentId;
      logger.debug('qa performance by agent report filter', reportFilter);

      const returnData = await reportAgentAndTeamPerfRepository.getReportQaPerformanceByAgent(reportFilter);

      logger.info(`get-report-qa-performance-by-agent completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/compliant-and-noncompliant', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-compliant-and-noncompliant', { query: req.query });
      const validated = ReportOfCompliantAndNoncompliantFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfCompliantAndNoncompliantFilter.errors };
        logger.error('get-report-compliant-and-noncompliant validate-error', {
          ...errorObject,
          debugMessage: ReportOfCompliantAndNoncompliantFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, groupId, startDate, endDate, view } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').toDate();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-compliant-and-noncompliant error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      let returnData = { reportHeaders: [], reportData: [] };
      const reportFilter = {
        trackType,
        formId,
        status: 'completed',
        completedDate: {
          $gte: dateStart,
          $lt: dateStop,
        },
      };
      if (groupId) reportFilter.groupId = groupId;
      logger.debug('compliant and noncompliant report filter', reportFilter);

      if (view === 'WEEK') {
        if (trackType == TrackTypeEnum.QA_CS) {
          returnData = await reportCompliantAndNoncompliantRepository.getReportCriteriaQaCsByWeek(reportFilter);
        } else if (trackType == TrackTypeEnum.KYC) {
          returnData = await reportCompliantAndNoncompliantRepository.getReportCriteriaKycByWeek(reportFilter);
        }
      } else {
        if (trackType == TrackTypeEnum.QA_CS) {
          returnData = await reportCompliantAndNoncompliantRepository.getReportCriteriaQaCsByDate(reportFilter);
        } else if (trackType == TrackTypeEnum.KYC) {
          returnData = await reportCompliantAndNoncompliantRepository.getReportCriteriaKycByDate(reportFilter);
        }
      }

      logger.info(`get-report-compliant-and-noncompliant completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      errorObject.errorMessage = error?.message;
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/variance', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-variance', { query: req.query });
      const validated = ReportOfVarianceFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfVarianceFilter.errors };
        logger.error('get-report-variance validate-error', { ...errorObject, debugMessage: ReportOfVarianceFilter.errors });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, team, startDate, endDate, groupId } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').unix();
      const dateStop = moment(endDate, 'DD/MM/YYYY').add(1, 'day').unix();
      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-variance error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      let returnData = { reportHeaders: [], reportData: [] };
      if (trackType == TrackTypeEnum.KYC) {
        const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formId });
        if (!criteriaKycData) {
          logger.error('get-report-variance error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('variance report filter', { criteriaKycData, formId, team, groupId, dateStart, dateStop });

        returnData = await reportOfVarianceWithKycUseCase.getVarianceReportOfKyc(
          criteriaKycData,
          formId,
          team === 'TEAM',
          groupId,
          dateStart,
          dateStop,
        );
      } else if (trackType === TrackTypeEnum.QA_CS) {
        const qaCsForm = await criteriaQaCsRepository.getOneByFilter({ _id: formId });
        if (!qaCsForm) {
          logger.error('get-report-variance error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('variance report filter', { formId, team, groupId, dateStart, dateStop });
        returnData = await reportOfVarianceWithKycUseCase.getVarianceReportOfQaCs(formId, team === 'TEAM', groupId, dateStart, dateStop);
      }

      logger.info(`get-report-variance completed.`);
      return res.status(200).json(returnData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/dispute-collecting', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-dispute-collecting', { query: req.query });
      const validated = ReportOfDisputeCollectingFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfDisputeCollectingFilter.errors };
        logger.error('get-report-dispute-collecting validate-error', {
          ...errorObject,
          debugMessage: ReportOfDisputeCollectingFilter.errors,
        });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, team, startDate, endDate, groupId } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').tz('Asia/Bangkok').startOf('day').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').tz('Asia/Bangkok').endOf('day').toDate();

      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-dispute-collecting error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      if (trackType == TrackTypeEnum.KYC) {
        const criteriaKycData = await criteriaKycRepository.getOneByFilter({ _id: formId });
        if (!criteriaKycData) {
          logger.error('get-report-dispute-collecting error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('dispute collecting report filter', { formId, team, groupId, dateStart, dateStop });
        const returnData = await reportOfDisputeCollectingUseCase.getDisputeCollectingReportOfKyc(
          formId,
          team === 'TEAM',
          groupId,
          dateStart,
          dateStop,
        );

        logger.info(`get-report-dispute-collecting completed.`);
        return res.status(200).json(returnData);
      } else {
        const qaCsForm = await criteriaQaCsRepository.getOneByFilter({ _id: formId });
        if (!qaCsForm) {
          logger.error('get-report-dispute-collecting error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('dispute collecting report filter', { formId, team, groupId, dateStart, dateStop });
        const returnData = await reportOfDisputeCollectingUseCase.getDisputeCollectingReportOfQaCs(
          formId,
          team === 'TEAM',
          groupId,
          dateStart,
          dateStop,
        );

        logger.info(`get-report-dispute-collecting completed.`);
        return res.status(200).json(returnData);
      }
    } catch (error) {
      logger.error(ErrorSetOfReports.BIQ_REP_00.errorMessage, error?.message);
      return res.status(500).json({ ...ErrorSetOfReports.BIQ_REP_00, debugMessage: error?.message });
    }
  });

  router.get('/feedback', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      logger.debug('get-report-feedback', { query: req.query });
      const validated = ReportOfFeedbackFilter(req.query);
      if (!validated) {
        const errorObject = { ...ErrorSetOfReports.BIQ_REP_01, validateErrorList: ReportOfFeedbackFilter.errors };
        logger.error('get-report-feedback validate-error', { ...errorObject, debugMessage: ReportOfFeedbackFilter.errors });
        return res.status(400).json(errorObject);
      }
      const { trackType, formId, team, startDate, endDate, groupId } = req.query;

      const dateStart = moment(startDate, 'DD/MM/YYYY').tz('Asia/Bangkok').startOf('day').toDate();
      const dateStop = moment(endDate, 'DD/MM/YYYY').tz('Asia/Bangkok').endOf('day').toDate();

      if (isNaN(dateStart) || isNaN(dateStop)) {
        logger.error('get-report-feedback error', ErrorSetOfReports.BIQ_REP_03);
        return res.status(400).json(ErrorSetOfReports.BIQ_REP_03);
      }

      if (trackType == TrackTypeEnum.KYC) {
        const formData = await criteriaKycRepository.getOneByFilter({ _id: formId });
        if (!formData) {
          logger.error('get-report-feedback error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('feedback report filter', { formData, team, groupId, dateStart, dateStop });
        const returnData = await reportOfFeedbackUseCase.getFeedbackReportOfKyc(formData, team === 'TEAM', groupId, dateStart, dateStop);
        logger.info(`get-report-feedback completed.`);
        return res.status(200).json(returnData);
      } else {
        const formData = await criteriaQaCsRepository.getOneByFilter({ _id: formId });
        if (!formData) {
          logger.error('get-report-feedback error', ErrorSetOfReports.BIQ_REP_05);
          return res.status(400).json(ErrorSetOfReports.BIQ_REP_05);
        }
        logger.debug('feedback report filter', { formData, team, groupId, dateStart, dateStop });
        const returnData = await reportOfFeedbackUseCase.getFeedbackReportOfQaCs(formData, team === 'TEAM', groupId, dateStart, dateStop);
        logger.info(`get-report-feedback completed.`);
        return res.status(200).json(returnData);
      }
    } catch (error) {
      const errorObject = { ...ErrorSetOfReports.BIQ_REP_00 };
      logger.critical(ErrorSetOfReports.BIQ_REP_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};

module.exports = ReportController;
