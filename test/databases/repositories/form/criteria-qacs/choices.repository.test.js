require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');

/* const db = require(path.resolve(`${dirname}/src/models/bik-models`));
const { formChoiceService } = require('../../src/classes/db-services/index');
let dbFormChoices = db.formChoices;
const FormChoiceService = new formChoiceService(); */

const { qacsChoiceModel } = require(path.resolve(`${dirname}/src/databases/models`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const CriteriaQaCsChoiceRepository = new repositoriesDb.criteriaQaCsChoiceRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get list by filter success', async () => {
    let mockReturnSuccessData = {
      choicedata: 'choicedata',
    };
    jest.spyOn(qacsChoiceModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsChoiceRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(qacsChoiceModel, 'find').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await CriteriaQaCsChoiceRepository.getListByFilter('')).toEqual(null);
  });
});

describe('getOneByFilter function', () => {
  test('Test get one by filter success', async () => {
    let mockReturnSuccessData = {
      choicedata: 'choicedata',
    };
    jest.spyOn(qacsChoiceModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsChoiceRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(qacsChoiceModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await CriteriaQaCsChoiceRepository.getOneByFilter('')).toEqual(null);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(qacsChoiceModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await CriteriaQaCsChoiceRepository.create()).toEqual(bodyData);
  });
});

describe('updateWithFilter function', () => {
  test('Test update with filter success', async () => {
    let mockReturnSuccessData = {
      choicedata: 'choicedata',
    };
    jest.spyOn(qacsChoiceModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsChoiceRepository.updateWithFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(qacsChoiceModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await CriteriaQaCsChoiceRepository.updateWithFilter()).toEqual(null);
  });
});

describe('removeItem function', () => {
  test('Test remoce item success', async () => {
    jest.spyOn(qacsChoiceModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await CriteriaQaCsChoiceRepository.removeItem('id')).toEqual(true);
  });
});
