const { onBreakTimeRepository, evaluateRepository } = require('../../databases/repositories');
const { onBreakTimeInEvaluateDTO } = require('../../dto/evaluate.dto');
class OnBreakTimeUseCase {
  constructor() {
    this.evaluateRepository = new evaluateRepository();
    this.onBreakTimeService = new onBreakTimeRepository();
  }

  async createOnBreakTime(evaluateData, payload) {
    const { _id: evaluateId, qaAgentId } = evaluateData;
    const { action, dateTime: startDate } = payload;
    const dataForCreate = {
      evaluateId,
      action,
      qaAgentId,
      startDate,
    };
    const onBreakTimeCreated = await this.onBreakTimeService.create(dataForCreate);
    if (onBreakTimeCreated) {
      const status = 'on-breaking';
      const onBreakTime = onBreakTimeInEvaluateDTO(onBreakTimeCreated);
      await this.evaluateRepository.update(evaluateId, { status, $push: { onBreakTimes: onBreakTime } });
    }
    return onBreakTimeCreated;
  }

  async updateOnBreakTime(onBreakTimeId, payload) {
    const { dateTime: endDate } = payload;
    const onBrakTimeData = await this.onBreakTimeService.getOneByFilter({ _id: onBreakTimeId, archived: false });
    if (onBrakTimeData) {
      const { startDate } = onBrakTimeData;
      const amount = (new Date(endDate) - new Date(startDate)) / 1000;
      const dataForUpdate = {
        amount,
        endDate,
        archived: true,
      };
      const onBreakTimeUpdated = await this.onBreakTimeService.update(onBreakTimeId, dataForUpdate);
      if (onBreakTimeUpdated) {
        const { evaluateId, endDate, archived } = onBreakTimeUpdated;
        const filter = {
          _id: evaluateId,
          'onBreakTimes.onBreakTimeId': onBreakTimeId,
        };
        const updateSet = {
          $set: {
            'onBreakTimes.$.endDate': endDate,
            'onBreakTimes.$.amount': amount,
            'onBreakTimes.$.archived': archived,
          },
        };
        await this.evaluateRepository.updateByFilter(filter, updateSet);
      }
      return onBreakTimeUpdated;
    }
    return false;
  }
}

module.exports = { OnBreakTimeUseCase };
