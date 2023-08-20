const path = require('path');
const dirname = require('app-root-path');
const { OnBreakTimeUseCase } = require(path.resolve(`${dirname}/src/applications/evaluates/on-break-times.usecase`));
const { onBreakTimeModel } = require(path.resolve(`${dirname}/src/databases/models/evaluates/on-break-times.model`));
const { evaluateModel } = require(path.resolve(`${dirname}/src/databases/models`));

const onBreakTimeUseCase = new OnBreakTimeUseCase();

describe('OnBreakTimeUseCase', () => {
  const payload = { action: 'start', dateTime: new Date() };
  test('createOnBreakTime', async () => {
    const evaluateData = { _id: 'evaluateId', qaAgentId: 'qaAgentId' };
    const mockReturnOnBreakTimeModelData = {
      status: true
    };
    jest.spyOn(onBreakTimeModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnOnBreakTimeModelData);
    });
    jest.spyOn(evaluateModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    const result = await onBreakTimeUseCase.createOnBreakTime(evaluateData, payload);
    expect(result).toEqual(mockReturnOnBreakTimeModelData);
  });

  describe('updateOnBreakTime', () => {
    test('should update success', async () => {
      const onBreakTimeId = 'onBreakTimeId';

      const mockReturnFindOneData = {
        startDate: '2023-08-01',
        status: true
      };
      jest.spyOn(onBreakTimeModel, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(mockReturnFindOneData);
      });

      let mockReturnFindByIdAndUpdateData = {
        status: true
      };
      jest.spyOn(onBreakTimeModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
        return Promise.resolve(mockReturnFindByIdAndUpdateData);
      });

      jest.spyOn(evaluateModel, 'updateOne').mockImplementationOnce(() => {
        return Promise.resolve(true);
      });

      const result = await onBreakTimeUseCase.updateOnBreakTime(onBreakTimeId, payload);

      expect(result).toEqual(mockReturnFindByIdAndUpdateData);
    });

    test('should return false', async () => {
      jest.spyOn(onBreakTimeModel, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(false);
      });
      const result = await onBreakTimeUseCase.updateOnBreakTime('nonExistentId', {});
      expect(result).toBe(false);
    });
  });
});
