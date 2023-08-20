require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');

const { assignmentModel, counterModel } = require(path.resolve(`${dirname}/src/databases/models`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const AssignmentRepository = new repositoriesDb.assignmentRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getListByFilter function', () => {
  test('Test get list by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    jest.spyOn(assignmentModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AssignmentRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(assignmentModel, 'find').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await AssignmentRepository.getListByFilter()).toEqual([]);
  });
});

describe('getOneWithFilter function', () => {
  test('Test get one with filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    jest.spyOn(assignmentModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AssignmentRepository.getOneWithFilter('mock')).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(assignmentModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(mockInvalidData);
    });
    expect(await AssignmentRepository.getOneWithFilter('')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(assignmentModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(bodyData);
    });
    expect(await AssignmentRepository.create()).toEqual(bodyData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(assignmentModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    let result;
    let error;

    try {
      result = await AssignmentRepository.create({ _id: 'id' });
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual(false);

    //expect(await AssignmentRepository.create({ _id: 'id' })).toEqual(false);
  });
});

describe('updateAssignmentByIdWithObject function', () => {
  test('Test update assignment by by id wuth object success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    jest.spyOn(assignmentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AssignmentRepository.updateAssignmentByIdWithObject()).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(assignmentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject(false);
    });

    let result;
    let error;

    try {
      result = await AssignmentRepository.updateAssignmentByIdWithObject();
    } catch (err) {
      error = err;
    }
  
    expect(result).toBeUndefined();
    expect(error).toEqual(false);

    //expect(await AssignmentRepository.updateAssignmentByIdWithObject()).toEqual(false);
  });
});

describe('addTaskNumber function', () => {
  test('Test add task number success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '638071a8f4455b2ba66dc2d4',
      activated: false,
      agentEmail: 'agent02@bitkub.com',
      agentId: '6313b2a1849e6cca2c57505f',
      assignmentDateTime: 1669362000,
      createdAt: 1671643771,
      fileId: '638071a2f4455b2ba66dc2cf',
      fileName: '20221128_191327_000002_66940422550_9df21e27_3c35_41e6_b932_fb63f2b11a13.wav',
      fileSize: 2,
      fileType: 'voice',
      fileUri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-11-25/bitqast-c2c974d7-4e60-41c5-8945-b4c5b4beeee7.wav',
      formId: '638070def4455b2ba66dc22c',
      groupId: '635987474b16253803502daa',
      groupName: 'New Authortity 3',
      netScore: null,
      qaAgentEmail: 'agentqa01@bitkub.com',
      qaAgentId: '624af91992655c203fa6851a',
      qaAgentName: 'agentqa01@bitkub.com',
      status: 'pending',
      taskNumber: 'TN-20221125-000001',
      trackType: 'criteria-kyc',
      varianceId: null,
      varianced: false,
    };
    
    jest.spyOn(await counterModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve({
        sequence: 1,
        date: '2023-07-10'
      });
    });
    jest.spyOn(await assignmentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AssignmentRepository.addTaskNumber('638071a8f4455b2ba66dc2d4')).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    jest.spyOn(await counterModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve({
        sequence: 1,
        date: '2023-07-10'
      });
    });
    jest.spyOn(assignmentModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    let result;
    let error;
    try {
      result = await AssignmentRepository.addTaskNumber();
    } catch (err) {
      error = err;
    }
    expect(result).toBeUndefined();
    expect(error).toEqual(false);
    //expect(await AssignmentRepository.addTaskNumber()).toEqual(false);
  });
});

/* describe('deleteAssignments function', () => {
  test('Test delete assignment success', async () => {
    let mockReturnFindById = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(assignmentModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    //await AssignmentRepository.create();
    expect(await AssignmentRepository.deleteAssignments(mockReturnFindById)).toEqual(true);
  });
  test('Test delete assignment < 0', async () => {
    let mockReturnFindById = { acknowledged: true, deletedCount: 0 };
    jest.spyOn(assignmentModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await AssignmentRepository.deleteAssignments({ _id: null })).toEqual(false);
  });
  test('Test error catch case', async () => {
    let mockReturnFindById = 'text';
    jest.spyOn(assignmentModel, 'deleteMany').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorIn-DeleteForm',
        message: 'Parameter "filter" to find() must be an object, got ',
      },
    };
    expect(await AssignmentRepository.deleteAssignments('')).toEqual(mockReturnErrCatchCase);
  });
}); */

describe('deleteAssignmentOne function', () => {
  test('Test delete one assignment success', async () => {
    const mockReturnFindById = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(assignmentModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    expect(await AssignmentRepository.deleteAssignmentOne({ _id: '1234' })).toEqual(true);
  });
  test('Test delete assignment < 0', async () => {
    let mockReturnDeleteOne = { acknowledged: true, deletedCount: 0 };
    jest.spyOn(assignmentModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnDeleteOne);
    });
    expect(await AssignmentRepository.deleteAssignmentOne(null)).toEqual(false);
  });
  test('Test error catch case', async () => {
    const mockReturnFindById = undefined;
    jest.spyOn(assignmentModel, 'deleteOne').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnFindById);
    });
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorIn-DeleteForm',
        message: "Cannot read properties of undefined (reading 'deletedCount')",
      },
    };
    expect(await AssignmentRepository.deleteAssignmentOne('')).toEqual(mockReturnErrCatchCase);
  });
});
