const express = require('express');
const __dir = require('app-root-path');
const path = require('path');
const moment = require('moment-timezone');
const { ErrorSetOfDashboard } = require(`../constants/error-sets`);
const { LoggerServices } = require('../logger');
const { maxValueInArray, calAvgValueInArray, minValueInArray } = require('../utilities');
const { createSummaryProcessHcDTO } = require('../dto/dashboards/summary-process.dto');
const { getListFilterForHC } = require(path.resolve(`${__dir}/src/utilities`));

const serviceName = 'dashboard';
const DashboardController = (options = {}) => {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  const { userRepository, auditlogRepository, dashboardRepository, assignmentRepository } = options;

  router.get('/total-task', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const dateString = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
      const assignmentAssignToDays = await assignmentRepository.getListByFilter({ assignDate: dateString });
      const amountAllTask = assignmentAssignToDays.length;
      const filterForOnlyCompleted = {
        date: dateString,
        service: 'evaluate',
        action: 'evaluate-completed',
      };
      const listCompletedAssignmentOfTheDay = await auditlogRepository.getAll(filterForOnlyCompleted);
      let amountEvaluateCompleted = 0;
      for (const assignment of assignmentAssignToDays) {
        const { _id: assignmentId } = assignment;
        const founded = listCompletedAssignmentOfTheDay.find((obj) => obj.properties.assignmentId === assignmentId);
        if (founded) amountEvaluateCompleted = amountEvaluateCompleted + 1;
      }
      let arrayCompletedAssignmentOfTheDay = [];
      for (const log of listCompletedAssignmentOfTheDay) {
        const { _id: evaluateId } = log.properties;
        const founded = assignmentAssignToDays.find((obj) => obj['_id'] === evaluateId);
        if (!founded) arrayCompletedAssignmentOfTheDay.push(log);
      }
      const returnDataForTotalTask = {
        date: dateString,
        all: amountAllTask,
        completed: amountEvaluateCompleted,
        uncompleted: amountAllTask - amountEvaluateCompleted,
      };
      logger.debug('response data', returnDataForTotalTask);
      res.status(200).json(returnDataForTotalTask);
      logger.info(`get-total-task completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/dispute-task', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const dateString = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
      const filterForAll = {
        date: dateString,
        service: 'dispute',
        action: 'dispute-created',
      };
      const listAllDisputeOfTheDay = await auditlogRepository.getAll(filterForAll);
      const amountAllDisputes = listAllDisputeOfTheDay.length;
      const filterForOnlyCompleted = {
        date: dateString,
        service: 'dispute',
        action: 'dispute-completed',
      };
      const listCompletedDisputeOfTheDay = await auditlogRepository.getAll(filterForOnlyCompleted);
      logger.debug('get-dispute-task', { filterForAll, filterForOnlyCompleted });
      let arrayCompletedDisputeOfTheDay = [];
      for (const log of listCompletedDisputeOfTheDay) {
        const founded = arrayCompletedDisputeOfTheDay.find((obj) => obj['properties']['evaluateId'] === log['properties']['evaluateId']);
        if (!founded) arrayCompletedDisputeOfTheDay.push(log);
      }
      const uncompletedAmount = amountAllDisputes - arrayCompletedDisputeOfTheDay.length;
      const returnDataForTotalTask = {
        data: dateString,
        all: amountAllDisputes,
        completed: arrayCompletedDisputeOfTheDay.length,
        uncompleted: uncompletedAmount < 0 ? 0 : uncompletedAmount,
      };
      logger.debug('response data', returnDataForTotalTask);
      res.status(200).json(returnDataForTotalTask);
      logger.info(`get-dispute-task completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/process-lists', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      let arrayList = [];
      const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
      const filterForAll = {
        date: date,
        service: 'evaluate',
        action: 'evaluate-started',
      };
      const listAllEvaluatedOfTheDay = await auditlogRepository.getAll(filterForAll);
      const filterForOnlyEvaluateCompleted = {
        date: date,
        service: 'evaluate',
        action: 'evaluate-completed',
      };
      logger.debug('get-process-lists', { filterForAll, filterForOnlyEvaluateCompleted });
      const listCompletedEvaluateOfTheDay = await auditlogRepository.getAll(filterForOnlyEvaluateCompleted);
      logger.debug('evaluated of the day', {
        length: listCompletedEvaluateOfTheDay.length,
        sample: listCompletedEvaluateOfTheDay.slice(0, 2),
      });
      for (const auditLog of listAllEvaluatedOfTheDay) {
        try {
          const evaluateId = auditLog['properties']['_id'];
          const evaluateFounded = listCompletedEvaluateOfTheDay.find((obj) => obj['properties']['_id'] === evaluateId);
          if (evaluateFounded) {
            const { _id: evaluateId, onBreakTimes } = evaluateFounded['properties'];

            if (evaluateId) {
              const summaryOnBreakTime = onBreakTimes?.map((obj) => obj['amount']).reduce((a, b) => a + b, 0) || 0;
              const tag = `process-lists`;
              const key = `${date}-${evaluateId}`;
              const rawDashboardData = await dashboardRepository.getOneByFilter({ tag, key });
             
              if (!rawDashboardData) {
                let qaAgentEmail = '';
                const qaAgentData = await userRepository.getOneUserByFilter({ _id: evaluateFounded['userId'] });
                if (qaAgentData) qaAgentEmail = qaAgentData['email'] || '';
                const processTime = evaluateFounded['createdAt'] - auditLog['createdAt'] - summaryOnBreakTime;
                const properties = {
                  taskNumber: evaluateFounded['properties']['taskNumber'] || '',
                  evaluateId,
                  qaAgentEmail,
                  trackType: evaluateFounded['properties']['trackType'] || '',
                  fileType: evaluateFounded['properties']['fileType'] || '',
                  date,
                  processTime: processTime,
                };
                const dataForCreateDashboard = { tag, key, date, processTime, properties };
                const rawDashboardCreated = await dashboardRepository.create(dataForCreateDashboard);
                if (rawDashboardCreated) arrayList.push({ ...rawDashboardCreated });
              } else {
                arrayList.push({ ...rawDashboardData });
              }
            }
          }
        } catch (error) {
          continue;
        }
      }

      logger.debug('response data', { length: arrayList.length, sample: arrayList.slice(0, 2) });
      res.status(200).json(arrayList);
      logger.info(`get-process-lists completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/summary-process', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const service = 'evaluate';
      const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      const toDayDate = moment().subtract(0, 'day').format('YYYY-MM-DD');
      const allEvaluteEnded = await auditlogRepository.getAll({ service, action: 'evaluate-completed', date: toDayDate });
      const allEvaluteStarted = await auditlogRepository.getAll({ service, action: 'evaluate-started', date: toDayDate });
      const allEvaluteYesterdayEnded = await auditlogRepository.getAll({ service, action: 'evaluate-completed', date: yesterdayDate });
      const allEvaluteYesterdayStarted = await auditlogRepository.getAll({ service, action: 'evaluate-started', date: yesterdayDate });
      const arrayCompletedToDay = [];
      const arrayCompletedYesterday = [];
      for (const evaluateStart of allEvaluteStarted) {
        const { _id: evaluateId } = evaluateStart.properties;
        const foudnedCompletedAtToDay = allEvaluteEnded.find((obj) => obj.properties._id === evaluateId);
        if (foudnedCompletedAtToDay) {
          arrayCompletedToDay.push({
            ...foudnedCompletedAtToDay,
            processTime: foudnedCompletedAtToDay.createdAt - evaluateStart.createdAt,
          });
        }
      }
      for (const evaluateEnd of allEvaluteYesterdayStarted) {
        const { _id: evaluateId } = evaluateEnd.properties;
        const foudnedCompleted = allEvaluteYesterdayEnded.find((obj) => obj.properties._id === evaluateId);
        if (foudnedCompleted) {
          arrayCompletedYesterday.push({
            ...foudnedCompleted,
            processTime: foudnedCompleted.createdAt - evaluateEnd.createdAt,
          });
        }
      }
      const avgTimeYesterday = arrayCompletedYesterday.length > 0 ? calAvgValueInArray(arrayCompletedYesterday, 'processTime') : null;
      const maxObjYesterday = arrayCompletedYesterday.length > 0 ? maxValueInArray(arrayCompletedYesterday, 'processTime') : {};
      const minObjYesterday = arrayCompletedYesterday.length > 0 ? minValueInArray(arrayCompletedYesterday, 'processTime') : {};
      const avgTimeToDay = arrayCompletedToDay.length > 0 ? calAvgValueInArray(arrayCompletedToDay, 'processTime') : null;
      const maxObjToDay = arrayCompletedToDay.length > 0 ? maxValueInArray(arrayCompletedToDay, 'processTime') : {};
      const minObjToDay = arrayCompletedToDay.length > 0 ? minValueInArray(arrayCompletedToDay, 'processTime') : {};
      const summaryYesterdayMax = createSummaryProcessHcDTO(maxObjYesterday);
      const summaryYesterdayMin = createSummaryProcessHcDTO(minObjYesterday);
      const summaryToDayMax = createSummaryProcessHcDTO(maxObjToDay);
      const summaryToDayMin = createSummaryProcessHcDTO(minObjToDay);
      const responseData = {
        avgTimeYesterday,
        avgTimeToDay,
        summaryYesterdayMax: { ...summaryYesterdayMax, tag: `summary-max-${yesterdayDate}`, key: 'summary-max', date: yesterdayDate },
        summaryYesterdayMin: { ...summaryYesterdayMin, tag: `summary-min-${yesterdayDate}`, key: 'summary-min', date: yesterdayDate },
        summaryToDayMax: { ...summaryToDayMax, tag: `summary-max-${toDayDate}`, key: 'summary-max', date: toDayDate },
        summaryToDayMin: { ...summaryToDayMin, tag: `summary-min-${toDayDate}`, key: 'summary-min', date: toDayDate },
      };
      logger.info(`get-summary-process completed.`);
      return res.status(200).json(responseData);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/agent-status-hc', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const toDayDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
      const arrayFilterList = getListFilterForHC(toDayDateString);
      const listAllOnDuty = await auditlogRepository.getListByFilter({ date: toDayDateString, service: 'progression' });
      const listOfUsers = listAllOnDuty.filter((v, i, a) => a.findIndex((v2) => v2.userId === v.userId) === i);
      let arrayUserCheckStatus = [];
      for (const user of listOfUsers) {
        const { userId } = user;
        arrayUserCheckStatus.push({ userId, startOnDuty: false });
      }
      let arrayUserTimeList = [];
      logger.debug('get-agent-status-hc', { arrayFilterList });
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const unixStartAt = moment(`${toDayDateString}T${startedFormat}`).unix();
        const unixEndAt = moment(`${toDayDateString}T${endedFormat}`).unix();
        for (const log of listAllOnDuty) {
          const { userId, createdAt } = log;
          const savedInTime = arrayUserTimeList.find(
            (obj) => obj.userId === userId && obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
          );
          if (!savedInTime) {
            const checkUserTemp = arrayUserCheckStatus.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (!startOnDuty) {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-started' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserTimeList.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            } else {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (!findInTime) {
                arrayUserTimeList.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            }
          } else {
            const checkUserTemp = arrayUserCheckStatus.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (startOnDuty) {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = false;
              }
            }
          }
        }
      }
      let arrayToDays = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const amountInTime = arrayUserTimeList.filter((obj) => obj.startedFormat === startedFormat && obj.endedFormat === endedFormat);
        arrayToDays.push({
          date: toDayDateString,
          ...objTime,
          key: `${startedFormat}-${endedFormat}`,
          amount: amountInTime.length,
        });
      }
      const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      const listAllOnDutyYesterday = await auditlogRepository.getListByFilter({ date: yesterdayDate, service: 'progression' });
      const listOfUsersYesterday = listAllOnDutyYesterday.filter((v, i, a) => a.findIndex((v2) => v2.userId === v.userId) === i);
      let arrayUserCheckStatusYesterday = [];
      for (const user of listOfUsersYesterday) {
        const { userId } = user;
        arrayUserCheckStatusYesterday.push({ userId, startOnDuty: false });
      }
      let arrayUserTimeListYesterday = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const unixStartAt = moment(`${yesterdayDate}T${startedFormat}`).unix();
        const unixEndAt = moment(`${yesterdayDate}T${endedFormat}`).unix();
        for (const log of listAllOnDutyYesterday) {
          const { userId, createdAt } = log;
          const savedInTime = arrayUserTimeListYesterday.find(
            (obj) => obj.userId === userId && obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
          );
          if (!savedInTime) {
            const checkUserTemp = arrayUserCheckStatusYesterday.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (!startOnDuty) {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-started' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserTimeListYesterday.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            } else {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (!findInTime) {
                arrayUserTimeListYesterday.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            }
          } else {
            const checkUserTemp = arrayUserCheckStatusYesterday.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (startOnDuty) {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = false;
              }
            }
          }
        }
      }
      let arrayYesterdays = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const amountInTime = arrayUserTimeListYesterday.filter(
          (obj) => obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
        );
        arrayYesterdays.push({
          date: toDayDateString,
          ...objTime,
          key: `${startedFormat}-${endedFormat}`,
          amount: amountInTime.length,
        });
      }
      logger.debug('response data', {
        arrayYesterdays: { length: arrayYesterdays.length, sample: arrayYesterdays.slice(0, 2) },
        arrayToDays: { length: arrayToDays.length, sample: arrayToDays.slice(0, 2) },
      });
      res.status(200).json({ arrayYesterdays, arrayToDays });
      logger.info(`get-agent-status-hc completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/available-hc', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const toDayDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
      const arrayFilterList = getListFilterForHC(toDayDateString);
      const listAllOnDuty = await auditlogRepository.getListByFilter({ date: toDayDateString, service: 'progression' });
      const listAllQaAgent = await userRepository.getListByFilter({ level: 'qaAgent' });
      const listOfUsers = listAllOnDuty.filter((v, i, a) => a.findIndex((v2) => v2.userId === v.userId) === i);
      let arrayUserCheckStatus = [];
      for (const user of listOfUsers) {
        const { userId } = user;
        arrayUserCheckStatus.push({ userId, startOnDuty: false });
      }
      let arrayUserTimeList = [];
      logger.debug('get-available-hc', { arrayFilterList });
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const unixStartAt = moment(`${toDayDateString}T${startedFormat}`).unix();
        const unixEndAt = moment(`${toDayDateString}T${endedFormat}`).unix();
        for (const log of listAllOnDuty) {
          const { userId, createdAt } = log;
          const savedInTime = arrayUserTimeList.find(
            (obj) => obj.userId === userId && obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
          );
          if (!savedInTime) {
            const checkUserTemp = arrayUserCheckStatus.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (!startOnDuty) {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-started' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserTimeList.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            } else {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (!findInTime) {
                arrayUserTimeList.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            }
          } else {
            const checkUserTemp = arrayUserCheckStatus.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (startOnDuty) {
              const findInTime = listAllOnDuty.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserCheckStatus[arrayUserCheckStatus.findIndex((obj) => obj.userId === userId)].startOnDuty = false;
              }
            }
          }
        }
      }
      let arrayToDays = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const amountInTime = arrayUserTimeList.filter((obj) => obj.startedFormat === startedFormat && obj.endedFormat === endedFormat);
        arrayToDays.push({
          date: toDayDateString,
          ...objTime,
          key: `${startedFormat}-${endedFormat}`,
          amount: listAllQaAgent.length - amountInTime.length,
        });
      }
      const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      const listAllOnDutyYesterday = await auditlogRepository.getListByFilter({ date: yesterdayDate, service: 'progression' });
      const listOfUsersYesterday = listAllOnDutyYesterday.filter((v, i, a) => a.findIndex((v2) => v2.userId === v.userId) === i);
      let arrayUserCheckStatusYesterday = [];
      for (const user of listOfUsersYesterday) {
        const { userId } = user;
        arrayUserCheckStatusYesterday.push({ userId, startOnDuty: false });
      }
      let arrayUserTimeListYesterday = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const unixStartAt = moment(`${yesterdayDate}T${startedFormat}`).unix();
        const unixEndAt = moment(`${yesterdayDate}T${endedFormat}`).unix();
        for (const log of listAllOnDutyYesterday) {
          const { userId, createdAt } = log;
          const savedInTime = arrayUserTimeListYesterday.find(
            (obj) => obj.userId === userId && obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
          );
          if (!savedInTime) {
            const checkUserTemp = arrayUserCheckStatusYesterday.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (!startOnDuty) {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-started' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserTimeListYesterday.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            } else {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (!findInTime) {
                arrayUserTimeListYesterday.push({ userId, startTime: createdAt, startedFormat, endedFormat });
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = true;
              }
            }
          } else {
            const checkUserTemp = arrayUserCheckStatusYesterday.find((obj) => obj.userId === userId);
            const { startOnDuty } = checkUserTemp;
            if (startOnDuty) {
              const findInTime = listAllOnDutyYesterday.find(
                (obj) => obj.userId === userId && obj.action === 'onduty-ended' && createdAt >= unixStartAt && createdAt < unixEndAt,
              );
              if (findInTime) {
                arrayUserCheckStatusYesterday[arrayUserCheckStatusYesterday.findIndex((obj) => obj.userId === userId)].startOnDuty = false;
              }
            }
          }
        }
      }
      let arrayYesterdays = [];
      for (const objTime of arrayFilterList) {
        const { startedFormat, endedFormat } = objTime;
        const amountInTime = arrayUserTimeListYesterday.filter(
          (obj) => obj.startedFormat === startedFormat && obj.endedFormat === endedFormat,
        );
        arrayYesterdays.push({
          date: toDayDateString,
          ...objTime,
          key: `${startedFormat}-${endedFormat}`,
          amount: listAllQaAgent.length - amountInTime.length,
        });
      }
      logger.debug('response data', {
        arrayYesterdays: { length: arrayYesterdays.length, sample: arrayYesterdays.slice(0, 2) },
        arrayToDays: { length: arrayToDays.length, sample: arrayToDays.slice(0, 2) },
      });
      res.status(200).json({ arrayYesterdays, arrayToDays });
      logger.info(`get-available-hc completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  router.get('/assignment-created', async (req, res) => {
    const logger = new LoggerServices(req, serviceName);
    try {
      const { userId, groupId } = req.query;
      const toDayDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
      const filterAassignmentCreated = {};
      filterAassignmentCreated['service'] = 'assignment';
      filterAassignmentCreated['action'] = 'assignment-created';
      filterAassignmentCreated['date'] = toDayDateString;
      if (userId) filterAassignmentCreated['properties.qaAgentId'] = userId;
      if (groupId) filterAassignmentCreated['properties.groupId'] = groupId;

      logger.debug('get-assignment-created', { filter: filterAassignmentCreated, query: req.query });
      const listCompletedEvaluateOfTheDay = await auditlogRepository.getAll(filterAassignmentCreated);

      const returnData = { ...req.query, amount: listCompletedEvaluateOfTheDay.length };
      logger.debug('response data', returnData);
      res.status(200).json(returnData);
      logger.info(`get-assignment-created completed.`);
    } catch (error) {
      const errorObject = { ...ErrorSetOfDashboard.BIQ_DSB_00 };
      logger.critical(ErrorSetOfDashboard.BIQ_DSB_00.errorMessage, { ...errorObject, debugMessage: error?.message });
      return res.status(500).json(errorObject);
    }
  });

  return router;
};
module.exports = DashboardController;
