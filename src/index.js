require('dotenv').config();
require('./passport.js');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const moment = require('moment-timezone');

const { ReportOfVarianceWithKycUseCase } = require('./applications/reports/variance-report.usecase.js');
const { ReportOfDisputeCollectingUseCase } = require('./applications/reports/dispute-collecting-report.usecase.js');
const { ReportOfFeedbackUseCase } = require('./applications/reports/feedback-report.usecase.js');
const { OnBreakTimeUseCase } = require('./applications/evaluates/on-break-times.usecase.js');
const {
  userRepository,
  groupRepository,
  memberRepository,
  overviewRepository,
  timeSettingRepository,
  accessibilitieRepository,
  permissionRepository,
  consentRepository,
  criteriaQaCsRepository,
  criteriaQaCsQuestionRepository,
  criteriaQaCsItemQuestionRepository,
  criteriaQaCsChoiceRepository,
  criteriaQaCsIssueRepository,
  assignmentRepository,
  disputeRepository,
  attachmentRepository,
  evaluateRepository,
  resultEvaluateOfCriteriaQaCsRepository,
  agentRepository,
  templateRepository,
  templateQuestionRepository,
  templateItemRepository,
  progressionRepository,
  auditlogRepository,
  dashboardRepository,
  varianceRepository,
  gradesRepository,
  reportAgentAndTeamPerfRepository,
  reportCompliantAndNoncompliantRepository,
  criteriaKycRepository,
  resultEvaluateOfCriteriaKycRepository,
  badAnalysisFormRepository,
  resultEvaluateOfBadAnalysisRepository,
  reportBadAnalysisRepository,
} = require('./databases/repositories');
//! middleware
const { ErrorMiddleware } = require('./middleware/error.middleware.js');
const { AuthorizationMiddleware } = require('./middleware/authorization-middleware.js');
const { TransactionMiddleware } = require('./middleware/transaction-middleware.js');
const { HealthCheckMiddleware } = require('./middleware/healthcheck-middleware.js');
const MetricsMiddleware = require('./middleware/metrics-middleware.js');

const AssignmentController = require('./controllers/assignments.controller.js');
const AuditlogsController = require('./controllers/auditlogs.controller.js');
const AuthenticationController = require('./controllers/authentications.controller.js');
const DashboardController = require('./controllers/dashboards.controller.js');
const DisputesController = require('./controllers/disputes.controller.js');
const EvaluatesController = require('./controllers/evaluates.controller.js');
const AttachmentController = require('./controllers/attachments.controller.js');
const FormsController = require('./controllers/forms.controller.js');
const GroupsController = require('./controllers/groups.controller.js');
const EmailController = require('./controllers/email.controller.js');
const ProgressionController = require('./controllers/progressions.controller.js');
const ReportController = require('./controllers/reports.controller.js');
const S3storageController = require('./controllers/s3.controller.js');
const SettingController = require('./controllers/settings.controller.js');
const SsoAuthenticationController = require('./controllers/sso-authentication.controller.js');
const TemplateController = require('./controllers/templates.controller.js');
const VariancesController = require('./controllers/variances.controller.js');
const configurations = require('../configurations/index.js');
const { csrfMiddleware, doubleCsrfProtection } = require('./middleware/csrf-protection.middleware.js');
process.env.TZ = 'Asia/Bangkok';
moment.tz.setDefault('Asia/Bangkok');

const corsOptionsDelegate = (req, callback) => {
  const corsOptions = {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  };
  const origin = req.header('Origin');
  if (configurations.allowedOrigins.indexOf(origin) !== -1) {
    corsOptions.origin = true;
  } else {
    corsOptions.origin = false;
  }
  callback(null, corsOptions);
};

app
  .use(session(configurations.session))
  .use(cookieParser(configurations.session.secret, configurations.csrfSession.cookie))
  .use(helmet.hidePoweredBy())
  .use(helmet.xssFilter())
  .use(cors(corsOptionsDelegate))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(MetricsMiddleware)
  .use(HealthCheckMiddleware)
  .use(passport.initialize())
  .use(passport.session())
  .use(
    '/sso',
    SsoAuthenticationController({
      passport,
      userRepository: new userRepository(),
      groupRepository: new groupRepository(),
      memberRepository: new memberRepository(),
      attachmentRepository: new attachmentRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .get('/csrf-token', csrfMiddleware)
  .use(doubleCsrfProtection)
  .use(TransactionMiddleware)
  .use(
    '/authenticate',
    AuthenticationController({
      userRepository: new userRepository(),
      groupRepository: new groupRepository(),
      memberRepository: new memberRepository(),
      attachmentRepository: new attachmentRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(AuthorizationMiddleware)
  .use(
    '/api/s3',
    S3storageController({
      attachmentRepository: new attachmentRepository(),
    }),
  )
  .use(
    '/api/assignments',
    AssignmentController({
      groupRepository: new groupRepository(),
      assignmentRepository: new assignmentRepository(),
      criteriaQaCsRepository: new criteriaQaCsRepository(),
      attachmentRepository: new attachmentRepository(),
      agentRepository: new agentRepository(),
      auditlogRepository: new auditlogRepository(),
      evaluateRepository: new evaluateRepository(),
      badAnalysisFormRepository: new badAnalysisFormRepository(),
      criteriaKycRepository: new criteriaKycRepository(),
    }),
  )
  .use(
    '/api/forms',
    FormsController({
      criteriaQaCsRepository: new criteriaQaCsRepository(),
      criteriaQaCsQuestionRepository: new criteriaQaCsQuestionRepository(),
      criteriaQaCsItemQuestionRepository: new criteriaQaCsItemQuestionRepository(),
      criteriaQaCsChoiceRepository: new criteriaQaCsChoiceRepository(),
      criteriaQaCsIssueRepository: new criteriaQaCsIssueRepository(),
      auditlogRepository: new auditlogRepository(),
      badAnalysisFormRepository: new badAnalysisFormRepository(),
      criteriaKycRepository: new criteriaKycRepository(),
    }),
  )
  .use(
    '/api/templates',
    TemplateController({
      templateRepository: new templateRepository(),
      templateQuestionRepository: new templateQuestionRepository(),
      templateItemRepository: new templateItemRepository(),
      auditlogRepository: new auditlogRepository(),
      badAnalysisFormRepository: new badAnalysisFormRepository(),
      criteriaKycRepository: new criteriaKycRepository(),
      resultEvaluateOfBadAnalysisRepository: new resultEvaluateOfBadAnalysisRepository(),
      resultEvaluateOfCriteriaKycRepository: new resultEvaluateOfCriteriaKycRepository(),
    }),
  )
  .use(
    '/api/evaluates',
    EvaluatesController({
      userRepository: new userRepository(),
      memberRepository: new memberRepository(),
      assignmentRepository: new assignmentRepository(),
      evaluateRepository: new evaluateRepository(),
      attachmentRepository: new attachmentRepository(),
      agentRepository: new agentRepository(),
      auditlogRepository: new auditlogRepository(),
      criteriaQaCsRepository: new criteriaQaCsRepository(),
      criteriaQaCsQuestionRepository: new criteriaQaCsQuestionRepository(),
      criteriaQaCsItemQuestionRepository: new criteriaQaCsItemQuestionRepository(),
      badAnalysisFormRepository: new badAnalysisFormRepository(),
      criteriaKycRepository: new criteriaKycRepository(),
      resultEvaluateOfBadAnalysisRepository: new resultEvaluateOfBadAnalysisRepository(),
      resultEvaluateOfCriteriaQaCsRepository: new resultEvaluateOfCriteriaQaCsRepository(),
      resultEvaluateOfCriteriaKycRepository: new resultEvaluateOfCriteriaKycRepository(),
      onBreakTimeUseCase: new OnBreakTimeUseCase(),
    }),
  )
  .use(
    '/api/disputes',
    DisputesController({
      criteriaQaCsRepository: new criteriaQaCsRepository(),
      assignmentRepository: new assignmentRepository(),
      disputeRepository: new disputeRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/variances',
    VariancesController({
      userRepository: new userRepository(),
      memberRepository: new memberRepository(),
      varianceRepository: new varianceRepository(),
      assignmentRepository: new assignmentRepository(),
      evaluateRepository: new evaluateRepository(),
      resultEvaluateOfCriteriaQaCsRepository: new resultEvaluateOfCriteriaQaCsRepository(),
      resultEvaluateOfCriteriaKycRepository: new resultEvaluateOfCriteriaKycRepository(),
      attachmentRepository: new attachmentRepository(),
      agentRepository: new agentRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/setting',
    SettingController({
      userRepository: new userRepository(),
      groupRepository: new groupRepository(),
      memberRepository: new memberRepository(),
      overviewRepository: new overviewRepository(),
      timeSettingRepository: new timeSettingRepository(),
      accessibilitieRepository: new accessibilitieRepository(),
      permissionRepository: new permissionRepository(),
      consentRepository: new consentRepository(),
      attachmentRepository: new attachmentRepository(),
      agentRepository: new agentRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/groups',
    GroupsController({
      userRepository: new userRepository(),
      groupRepository: new groupRepository(),
      memberRepository: new memberRepository(),
      overviewRepository: new overviewRepository(),
      accessibilitieRepository: new accessibilitieRepository(),
      permissionRepository: new permissionRepository(),
      agentRepository: new agentRepository(),
      auditlogRepository: new auditlogRepository(),
      progressionRepository: new progressionRepository(),
      gradesRepository: new gradesRepository(),
    }),
  )
  .use(
    '/api/files',
    AttachmentController({
      attachmentRepository: new attachmentRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/progressions',
    ProgressionController({
      userRepository: new userRepository(),
      groupRepository: new groupRepository(),
      memberRepository: new memberRepository(),
      progressionRepository: new progressionRepository(),
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/auditlogs',
    AuditlogsController({
      auditlogRepository: new auditlogRepository(),
    }),
  )
  .use(
    '/api/dashboard',
    DashboardController({
      userRepository: new userRepository(),
      memberRepository: new memberRepository(),
      auditlogRepository: new auditlogRepository(),
      dashboardRepository: new dashboardRepository(),
      assignmentRepository: new assignmentRepository(),
    }),
  )
  .use(
    '/api/reports',
    ReportController({
      auditlogRepository: new auditlogRepository(),
      criteriaQaCsRepository: new criteriaQaCsRepository(),
      badAnalysisFormRepository: new badAnalysisFormRepository(),
      resultEvaluateOfBadAnalysisRepository: new resultEvaluateOfBadAnalysisRepository(),
      assignmentRepository: new assignmentRepository(),
      evaluateRepository: new evaluateRepository(),
      resultEvaluateOfCriteriaQaCsRepository: new resultEvaluateOfCriteriaQaCsRepository(),
      gradesRepository: new gradesRepository(),
      criteriaKycRepository: new criteriaKycRepository(),
      reportAgentAndTeamPerfRepository: new reportAgentAndTeamPerfRepository(),
      reportCompliantAndNoncompliantRepository: new reportCompliantAndNoncompliantRepository(),
      reportBadAnalysisRepository: new reportBadAnalysisRepository(),
      reportOfVarianceWithKycUseCase: new ReportOfVarianceWithKycUseCase(),
      reportOfDisputeCollectingUseCase: new ReportOfDisputeCollectingUseCase(),
      reportOfFeedbackUseCase: new ReportOfFeedbackUseCase(),
    }),
  )
  .use('/email', EmailController())
  .use(ErrorMiddleware);

const server = app.listen(process.env.PORT, () => {});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});
