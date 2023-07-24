const services = {};

services.userRepository = require('./users.repository');
services.groupRepository = require('./groups.repository');
services.memberRepository = require('./groupings/members.repository');
services.overviewRepository = require('./overview.repository');
services.timeSettingRepository = require('./settings/times.repository');
services.accessibilitieRepository = require('./settings/accessibilities.repository');
services.permissionRepository = require('./settings/permissions.repository');
services.consentRepository = require('./settings/consents.repository');

services.templateRepository = require('./templates/templates.repository');
services.templateQuestionRepository = require('./templates/questions.repository');
services.templateItemRepository = require('./templates/items.repository');

services.criteriaQaCsRepository = require('./forms/criteria-qacs/criteria-qacs.repository');
services.criteriaQaCsQuestionRepository = require('./forms/criteria-qacs/questions.repository');
services.criteriaQaCsItemQuestionRepository = require('./forms/criteria-qacs/items.repository');
services.criteriaQaCsChoiceRepository = require('./forms/criteria-qacs/choices.repository');
services.criteriaQaCsIssueRepository = require('./forms/criteria-qacs/issues.repository');
services.criteriaKycRepository = require('./forms/criteria-kyc/criteria-kyc-form.repository');
services.badAnalysisFormRepository = require('./forms/bad-analysis/bad-analysis-form.repository');

services.assignmentRepository = require('./assignments/assignments.repository');
services.disputeRepository = require('./disputes/disputes.repository');

services.evaluateRepository = require('./evaluates/evaluates.repository');
services.resultEvaluateOfCriteriaQaCsRepository = require('./evaluates/result-criteria-qacs.repository');
services.resultEvaluateOfCriteriaKycRepository = require('./evaluates/result-criteria-kyc.repository');
services.resultEvaluateOfBadAnalysisRepository = require('./evaluates/result-bad-analysis.repository');

services.attachmentRepository = require('./attachments/attachments.repository');
services.agentRepository = require('./agents.repository');
services.progressionRepository = require('./progressions/progressions.repository');
services.auditlogRepository = require('./auditlogs.repository');
services.dashboardRepository = require('./dashboards.repository');
services.varianceRepository = require('./variances/variances.repository');
services.gradesRepository = require('./groupings/grades.repository');

services.reportAgentAndTeamPerfRepository = require('./reports/report-agent-and-team-perf.repository');
services.reportCompliantAndNoncompliantRepository = require('./reports/report-compliant-and-noncompliant.repository');
services.reportBadAnalysisRepository = require('./reports/report-bad-analysis.repository');
services.onBreakTimeRepository = require('./evaluates/on-break-time.repository');

module.exports = services;
