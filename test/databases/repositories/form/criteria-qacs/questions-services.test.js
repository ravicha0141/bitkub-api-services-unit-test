require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { criteriaQaCsQuestionRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbCriteriaQacsQuestionModel = dbModels.criteriaQacsQuestionModel;
const CriteriaQaCsQuestionRepository = new criteriaQaCsQuestionRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListOfQuestionsByFilter function', () => {
  test('Test get list of questions by filter success', async () => {
    let mockReturnSuccessData = [
      {
        _id: 'data _id',
        formId: 'data formId',
        title: 'data title',
        weight: 'data weight',
        detail: 'data detail',
        listQuestions: [{ questionTitle: 'data questionTitle' }],
        __v: 0,
      },
    ];
    jest.spyOn(dbCriteriaQacsQuestionModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsQuestionRepository.getListOfQuestionsByFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await CriteriaQaCsQuestionRepository.getListOfQuestionsByFilter('')).toEqual(false);
  });
});

describe('getOneQuestionsWithFilter function', () => {
  test('Test get one questions with filter success', async () => {
    let mockReturnSuccessData = {
      __v: 'data __v',
      _id: 'data _id',
      detail: 'data detail',
      formId: 'data formId',
      listQuestions: [
        {
          choices: [
            { choiceTitle: 'test1', point: 1 },
            { choiceTitle: 'test1', point: 1 },
          ],
          questionTitle: 'Faltal/NonFaltal',
        },
      ],
      title: 'data title',
    };
    jest.spyOn(dbCriteriaQacsQuestionModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await CriteriaQaCsQuestionRepository.getOneQuestionsWithFilter({})).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await CriteriaQaCsQuestionRepository.getOneQuestionsWithFilter('')).toEqual(null);
  });
});

describe('createQuestionOfForm function', () => {
  test('Test cretat question of form success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(dbCriteriaQacsQuestionModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await CriteriaQaCsQuestionRepository.createQuestionOfForm()).toEqual(bodyData);
  });
  test('Test error catch case', async () => {
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorIn-CreateForm',
        message: 'Unexpected token u in JSON at position 0',
      },
    };
    const mockInvalidData = undefined;
    jest.spyOn(dbCriteriaQacsQuestionModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockInvalidData));
    });
    expect(await CriteriaQaCsQuestionRepository.createQuestionOfForm()).toEqual(mockReturnErrCatchCase);
  });
});

describe('updateQuestionFormByIdWithObject function', () => {
  test('Test update question form by id success', async () => {
    let mockReturnFindById = 'questionId';
    let mockReturnFindByIdAndUpdate = 'itemNameUpdate';
    jest.spyOn(dbCriteriaQacsQuestionModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnFindById),
    }));
    jest.spyOn(dbCriteriaQacsQuestionModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnFindByIdAndUpdate),
    }));
    let mockReturnUpdateSuccess = { formId: 'itemNameUpdate' };
    expect(
      await CriteriaQaCsQuestionRepository.updateQuestionFormByIdWithObject(mockReturnFindById, { formId: mockReturnFindByIdAndUpdate }),
    ).toEqual(mockReturnUpdateSuccess);
  });
  test('Test update question form by id fail, data not found', async () => {
    let mockReturnNotFound = undefined;
    jest.spyOn(await dbCriteriaQacsQuestionModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockReturnValue(mockReturnNotFound),
    }));
    let mockDataNotFound = {
      error: {
        code: `questionFormNotFound`,
        message: `${mockReturnNotFound} is not found.`,
      },
    };
    expect(
      await CriteriaQaCsQuestionRepository.updateQuestionFormByIdWithObject(mockReturnNotFound, {}),
    ).toEqual(JSON.parse(JSON.stringify(mockDataNotFound)));
  });
  test('Test error catch case', async () => {
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorInUpdateGroupByFilter',
        message: 'Unexpected token u in JSON at position 0',
      },
    };
    const mockInvalidData = undefined;
    jest.spyOn(dbCriteriaQacsQuestionModel, 'findById').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockInvalidData));
    });
    expect(await CriteriaQaCsQuestionRepository.updateQuestionFormByIdWithObject('')).toEqual(mockReturnErrCatchCase);
  });
});

describe('deleteQuestionOfForm function', () => {
  test('Test delete Question Of Form success', async () => {
    let mockReturnFindById = { deletedCount: 1 };
    jest.spyOn(dbCriteriaQacsQuestionModel, 'deleteOne').mockImplementationOnce(() => {
      return mockReturnFindById;
    });
    expect(await CriteriaQaCsQuestionRepository.deleteQuestionOfForm({ _id: '' })).toEqual(true);
  });
  test('Test delete Question Of Form < 0', async () => {
    let mockReturnDeleteOne = { deletedCount: 0 };
    jest.spyOn(dbCriteriaQacsQuestionModel, 'deleteOne').mockImplementationOnce(() => {
      return mockReturnDeleteOne;
    });
    expect(await CriteriaQaCsQuestionRepository.deleteQuestionOfForm(null)).toEqual(false);
  });
  test('Test error catch case', async () => {
    let mockReturnFindById = undefined;
    jest.spyOn(dbCriteriaQacsQuestionModel, 'deleteOne').mockImplementationOnce(() => {
      return mockReturnFindById;
    });
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorIn-DeleteForm',
        message: "Cannot read properties of undefined (reading 'deletedCount')",
      },
    };
    expect(await CriteriaQaCsQuestionRepository.deleteQuestionOfForm('')).toEqual(mockReturnErrCatchCase);
  });
});
