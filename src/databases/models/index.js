const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbModels = {};

dbModels.userModel = require('./users.model');
dbModels.groupModel = require('./groups.model');
dbModels.requestSigninModel = require('./request_signin.model');
dbModels.userAuthenModel = require('./userAuthen.model');
dbModels.overviewModel = require('./overviews.model');
dbModels.timeSettingModel = require('./settings/times.model');
dbModels.accessManagementModel = require('./settings/access-managements.model');
dbModels.permissionModel = require('./settings/permissions.model');
dbModels.consentModel = require('./settings/consents.model');

dbModels.criteriaQaCsFormModel = require('./forms/criteria-qacs-form/criteria-qa-cs.model');
dbModels.criteriaQacsQuestionModel = require('./forms/criteria-qacs-form/questions.model');
dbModels.criteriaQacsItemModel = require('./forms/criteria-qacs-form/items.model');
dbModels.qacsChoiceModel = require('./forms/criteria-qacs-form/choices.model');
dbModels.qacsIssueModel = require('./forms/criteria-qacs-form/issues.model');
dbModels.criteriaKycFormModel = require('./forms/criteria-kyc-form/criteria-kyc.model');

dbModels.evaluateModel = require('./evaluates/evaluates.model');
dbModels.resultEvaluateOfQaCsModel = require('./evaluates/result-of-criteria-qacs.model');
dbModels.resultEvaluateOfKycModel = require('./evaluates/result-of-criteria-kyc.model');
dbModels.resultEvaluateOfBadAnalysis = require('./evaluates/result-of-bad-analysis.model');

dbModels.assignmentModel = require('./assignments/assignments.model');
dbModels.disputeModel = require('./disputes/disputes.model');
dbModels.attachmentModel = require('./storages/storageFiles.model');
dbModels.counterModel = require('./counters.model');
dbModels.agentModel = require('./agents.model');
dbModels.memberModel = require('./members.model');
dbModels.progressionModel = require('./progressions.model');
dbModels.auditlogModel = require('./auditlogs.model');
dbModels.dashboardModel = require('./dashboard.model');
dbModels.templateModel = require('./templates/templates.model');
dbModels.templateQuestionModel = require('./templates/template_questions.model');
dbModels.itemOfTemplateModel = require('./templates/template_items.model');
dbModels.varianceModel = require('./variances/variances.model');
dbModels.gradeModel = require('./grades.model');

module.exports = dbModels;
