require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { userRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbUserModel = dbModels.userModel;
let dbRequestSigninModel = dbModels.requestSigninModel;
let dbUserAuthenModel = dbModels.userAuthenModel;
const UserRepository = new userRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOneUserByFilter function', () => {
  test('Test get one user by filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'active',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(dbUserModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getOneUserByFilter({ _id: '6236b84255b3320bd1642735' })).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await UserRepository.getOneUserByFilter({ _id: '1234' })).toEqual(null);
  });
});

describe('getOneUserByFilterWithPassword function', () => {
  test('Test get One User By Filter With Password success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'active',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(dbUserModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getOneUserByFilterWithPassword({ _id: '6236b84255b3320bd1642735' })).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await UserRepository.getOneUserByFilterWithPassword({ _id: '1234' })).toEqual(null);
  });
});

describe('getALlUsers function', () => {
  test('Test get all users success', async () => {
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '123456789012345678901',
        criteria: 'criteria',
        email: 'test1@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'deactive',
        teams: ['QA'],
        telephone: 'String',
        username: 'test1',
      },
      {
        __v: 0,
        _id: '123456789012345678902',
        criteria: 'criteria',
        email: 'test2@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: ['CS'],
        telephone: 'String',
        username: 'test2',
      },
      {
        __v: 0,
        _id: '123456789012345678903',
        criteria: 'String',
        email: 'test3@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: [],
        telephone: 'String',
        username: 'test3',
      },
    ];
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getAllUsers('qaAgent')).toEqual(mockReturnSuccessData);
  });
  // test('Test error catch case', async () => {
  //   expect(await UserRepository.getAllUsers('')).toEqual(false);
  // });
});

describe('getListByFilter function', () => {
  test('Test get List By Filter success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'active',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getListByFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('checkUserExist function', () => {
  test('Test check User Exist success', async () => {
    jest.spyOn(dbUserModel, 'exists').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await UserRepository.checkUserExist({ _id: '6236b84255b3320bd1642735' })).toEqual(true);
  });
  test('Test error catch case', async () => {
    expect(await UserRepository.checkUserExist({ _id: '1234' })).toEqual(null);
  });
});

describe('updateUserByObject function', () => {
  test('Test update user by object success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'active',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(dbUserModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({
      then: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.updateUserByObject('6236b84255b3320bd1642735', mockReturnSuccessData)).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    expect(await UserRepository.updateUserByObject('')).toEqual(null);
  });
});

describe('deleteUser function', () => {
  test('Test delete user success', async () => {
    jest.spyOn(dbUserModel, 'findOneAndRemove').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(true),
    }));
    
    expect(await UserRepository.deleteUser('6236b84255b3320bd1642735')).toEqual(true);
  });
  test('Test error catch case', async () => {
    expect(await UserRepository.deleteUser('')).toEqual(null);
  });
});

describe('checkDupEmailAndUssername function', () => {
  test('Test check Dup Email And Ussername success', async () => {
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '123456789012345678901',
        criteria: 'criteria',
        email: 'test1@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'deactive',
        teams: ['QA'],
        telephone: 'String',
        username: 'test1',
      },
      {
        __v: 0,
        _id: '123456789012345678902',
        criteria: 'criteria',
        email: 'test2@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: ['CS'],
        telephone: 'String',
        username: 'test2',
      },
      {
        __v: 0,
        _id: '123456789012345678903',
        criteria: 'String',
        email: 'test3@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: [],
        telephone: 'String',
        username: 'test3',
      },
    ];
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    
    expect(await UserRepository.checkDupEmailAndUssername('test@gmail.com', 'test1234')).toEqual(true);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(''),
    }));
    expect(await UserRepository.checkDupEmailAndUssername('test@gmail.com', 'test1234')).toEqual(false);
  });
});

describe('create function', () => {
  test('Test create data success', async () => {
    let bodyData = { username: 'JohnDoe', email: 'john.doe@example.com', type: 'SSO_AUTHEN' };
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '123456789012345678901',
        criteria: 'criteria',
        email: 'test1@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'deactive',
        teams: ['QA'],
        telephone: 'String',
        username: 'test1',
      },
      {
        __v: 0,
        _id: '123456789012345678902',
        criteria: 'criteria',
        email: 'test2@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: ['CS'],
        telephone: 'String',
        username: 'test2',
      },
      {
        __v: 0,
        _id: '123456789012345678903',
        criteria: 'String',
        email: 'test3@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: [],
        telephone: 'String',
        username: 'test3',
      },
    ];
    jest.spyOn(dbUserModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await UserRepository.create(bodyData)).toEqual(mockReturnSuccessData);
  });
});

describe('createAndCheckDup function', () => {
  test('Test create And Check Dup length > 0', async () => {
    let bodyData = { username: 'JohnDoe', email: 'john.doe@example.com', type: 'SSO_AUTHEN' };
    let mockReturnSuccessData = [
      {
        __v: 0,
        _id: '123456789012345678901',
        criteria: 'criteria',
        email: 'test1@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'deactive',
        teams: ['QA'],
        telephone: 'String',
        username: 'test1',
      },
      {
        __v: 0,
        _id: '123456789012345678902',
        criteria: 'criteria',
        email: 'test2@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: ['CS'],
        telephone: 'String',
        username: 'test2',
      },
      {
        __v: 0,
        _id: '123456789012345678903',
        criteria: 'String',
        email: 'test3@gmail.com',
        image: 'String',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: [],
        telephone: 'String',
        username: 'test3',
      },
    ];
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.createAndCheckDup(bodyData, bodyData)).toEqual(false);
  });
  test('Test create And Check Dup success case', async () => {
    let bodyData = {
      username: 'JohnDoe',
      email: 'john.doe@example.com',
      type: 'SITE_AUTHEN',
      password: '123456789012345678901234567890123456789012345678901234567890',
    };
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(''),
    }));
    jest.spyOn(dbUserModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await UserRepository.createAndCheckDup(bodyData, bodyData)).toEqual(true);
  });
  test('Test create And Check Dup catch case', async () => {
    let bodyData = { username: 'JohnDoe', email: 'john.doe@example.com', type: 'SSO_AUTHEN' };
    
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(''),
    }));
    expect(await UserRepository.createAndCheckDup(bodyData, bodyData)).toEqual(false);
  });
  test('Test create And Check Dup catch error', async () => {
    let bodyData = { username: 'JohnDoe', email: 'john.doe@example.com', type: 'SSO_AUTHEN' };
    let returnError = { message: 'undefined', status: false };
    /* jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => {
      return Promise.reject(false);
    }); */
    jest.spyOn(dbUserModel, 'find').mockImplementationOnce(() => ({
      exec: jest.fn().mockRejectedValue(false),
    }));
    expect(await UserRepository.createAndCheckDup(bodyData, bodyData)).toEqual(returnError);
  });
});

describe('updateUserByFilter function', () => {
  test('Test update user by filter success', async () => {
    let mockReturnFindById = { _id: '624fe297790139ea1d688543' };
    let mockReturnFindByIdAndUpdate = [
      {
        __v: 0,
        criteria: 'criteria',
        email: 'test@test.com',
        image: '',
        level: ['qaAgent'],
        password: '123456789012345678901234567890123456789012345678901234567890',
        status: 'active',
        teams: ['QA'],
        username: 'test1234',
      },
    ];
    let mockReturnSuccess = {
      data: [
        {
          __v: 0,
          criteria: 'criteria',
          email: 'test@test.com',
          image: '',
          level: ['qaAgent'],
          password: '123456789012345678901234567890123456789012345678901234567890',
          status: 'active',
          teams: ['QA'],
          username: 'test1234',
        },
      ],
      status: true,
    };
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnFindById),
    }));
    jest.spyOn(dbUserModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnFindByIdAndUpdate),
    }));
    expect(await UserRepository.updateUserByFilter(mockReturnFindById, mockReturnFindByIdAndUpdate)).toEqual(mockReturnSuccess);
  });
  test('Test update user by filter fail, data not found', async () => {
    let mockReturnDataNotFound = null;
    let mockDataNotFound = ({ _id: '62cc446c958487995d759075' }, [{ username: 'data username' }]);
    let mockReturnErrCatchCase = {
      message: '[object Object] is not found.',
      status: false,
    };
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnDataNotFound),
    }));
    expect(await UserRepository.updateUserByFilter(mockDataNotFound)).toEqual(mockReturnErrCatchCase);
  });
  test('Test error catch case', async () => {
    let mockReturnErrCatchCase = {
      message: 'Unexpected token u in JSON at position 0',
      status: false,
    };
    const mockReturnInvalidData = undefined;
    let mockInvalidData = ({ _id: '62cc446c958487995d759075' }, [{ username: 'data username' }]);
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockReturnInvalidData));
    });
    expect(await UserRepository.updateUserByFilter(mockInvalidData)).toEqual(mockReturnErrCatchCase);
  });
});

describe('getUserProfile function', () => {
  test('Test get user profile success', async () => {
    let mockReturnSuccessData = {
      __v: 0,
      _id: '123456789012345678901',
      criteria: 'criteria',
      email: 'test1@gmail.com',
      image: '',
      level: ['qaAgent'],
      password: '123456789012345678901234567890123456789012345678901234567890',
      status: 'active',
      teams: ['QA'],
      username: 'test1',
    };
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getUserProfile('')).toEqual(mockReturnSuccessData);
  });
  test('Test get user profile fail, data not found', async () => {
    let mockReturnNotFound = null;
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnNotFound),
    }));
    let mockDataNotFound = {
      error: { code: 'userNotFound', message: 'user id  not found.' },
    };
    expect(await UserRepository.getUserProfile('')).toEqual(mockDataNotFound);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = 'text';
    let mockReturnErrCatchCase = {
      error: {
        code: 'errorInGetUserProfile',
        message: 'Unexpected token e in JSON at position 1',
      },
    };
    jest.spyOn(dbUserModel, 'findById').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockInvalidData));
    });
    expect(await UserRepository.getUserProfile('')).toEqual(mockReturnErrCatchCase);
  });
});

describe('getAccessToken function', () => {
  // test('Test get access token success', async () => {
  //   let bodyData = {
  //     username: 'JohnDoe',
  //     email: 'john.doe@example.com',
  //     type: 'SSO_AUTHEN',
  //     password: '123456789012345678901234567890123456789012345678901234567890',
  //     accessToken:
  //       'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1NjM0NzMwNn0.m3l5hKdKrSjL6GP6DaUqL_lvhWIdmxyMkHTtCCyxxSyEUFLDFb99E3-Dv-ROCRqpRyppKAABdDNCt14n4lh9mjb7VdA4dnpRR_LKqr8gO4pTqD79cACJ-GsVfeO6F9CpaJlnx_NjkiuIU3nfIiaPJtZUSONQxQzjyzJTU2zMVCX_iaASibAAgXxbLCd04fBVk1Kz5zmfeMMbAKpWHu16Kh1dTP6G3va60pxly9pE_uWmCVNjivzZi2ByjumvlVuHwYdXzgBqU8bf8v4xBIXXAjV4x4J0vJnrzDKfJoQ2uCH70Yb00oDPj3yR2HEx8JcGzuWa8jzPH3sDxcga3JtUJg',
  //     refreshToken:
  //       'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1Njg2NTcwNn0.ltw_42e_Q7AvvC1GXoobZkyb6R3Xp3KZNotU0KAYTgUhikvltC0sq6XWcKZuGCombDaqCnSJ2e8OCsrkZazqEr_H-InQ8c1XOgf4O-28XGFvL3QO8Ftacd-_w9_NW45e1hfMQ40UvCBwRxVTvjwSvt_pItyciBxiPAxjlX2sbzmVdkywzKHqbwwcvKkJEZpFCRXz5N5ETO2qtD4ACSdQzC-2MbUB0EeYF5qHsBUsBZ8RJJ_rNO1eewRQgCDGoEzCCRQDn1GGrJeOchaOtMNegkLZvpyCfnYmCiATZuxeR5LP9lLmZK7QQSUVeJrzt_oQvSYHImTPsav5eqnd_JRzHw',
  //   };
  //   expect(await UserRepository.getAccessToken(bodyData, { remember: true })).toEqual(false);
  // });
  test('Test error catch case', async () => {
    expect(await UserRepository.getAccessToken('')).toEqual(false);
  });
});

describe('increaseRequestSignIn function', () => {
  test('Test increase request sign in success', async () => {
    let mockReturnSuccessData = {
      count: 1,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: 1671553891,
      status: 'statusTest',
    };
    jest.spyOn(dbRequestSigninModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(dbRequestSigninModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await UserRepository.increaseRequestSignIn(mockReturnSuccessData)).toEqual(true);
  });
  test('Test increase request sign in find one catch case', async () => {
    let mockReturnSuccessData = {
      count: 1,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: 1671553891,
      status: 'statusTest',
    };
    jest.spyOn(dbRequestSigninModel, 'findOne').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await UserRepository.increaseRequestSignIn(mockReturnSuccessData)).toEqual(false);
  });
  test('Test error request data invalid case', async () => {
    let mockReturnSuccessData = {
      count: 1,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: 1671553891,
      status: 'statusTest',
    };
    jest.spyOn(dbRequestSigninModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve('');
    });
    jest.spyOn(dbRequestSigninModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await UserRepository.increaseRequestSignIn()).toEqual(mockReturnSuccessData);
  });
  test('Test increase request sign in find by id and update catch case', async () => {
    let mockReturnSuccessData = {
      count: 1,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: 1671553891,
      status: 'statusTest',
    };
    jest.spyOn(dbRequestSigninModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(dbRequestSigninModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      return Promise.reject(false);
    });
    expect(await UserRepository.increaseRequestSignIn(mockReturnSuccessData)).toEqual(false);
  });
  test('Test error catch case', async () => {
    let mockData = {};
    jest.spyOn(dbRequestSigninModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockData));
    });
    expect(await UserRepository.increaseRequestSignIn('')).toEqual(false);
  });
});

describe('setRequestSignInDeactive function', () => {
  test('Test set Request Sign In Deactive success', async () => {
    jest.spyOn(dbUserModel, 'findOneAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(true),
    }));
    expect(await UserRepository.setRequestSignInDeactive('')).toEqual(true);
  });
  test('Test error catch case', async () => {
    jest.spyOn(dbUserModel, 'findOneAndUpdate').mockImplementationOnce(() => ({
      exec: jest.fn().mockRejectedValue(false),
    }));
    expect(await UserRepository.setRequestSignInDeactive('')).toEqual(false);
  });
});

describe('clearRequestSignIn function', () => {
  test('clearRequestSignIn should delete request sign in data', async () => {
    jest.spyOn(dbRequestSigninModel, 'find').mockImplementationOnce(() => ({
      deleteMany: jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(true),
      }))
  }));
    expect(await UserRepository.clearRequestSignIn('')).toEqual(true);
  });
});

describe('updateTokenOfUser function', () => {
  test('Test create user token success', async () => {
    let email = 'test1234@gmail.com';
    let accessToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1NjM0NzMwNn0.m3l5hKdKrSjL6GP6DaUqL_lvhWIdmxyMkHTtCCyxxSyEUFLDFb99E3-Dv-ROCRqpRyppKAABdDNCt14n4lh9mjb7VdA4dnpRR_LKqr8gO4pTqD79cACJ-GsVfeO6F9CpaJlnx_NjkiuIU3nfIiaPJtZUSONQxQzjyzJTU2zMVCX_iaASibAAgXxbLCd04fBVk1Kz5zmfeMMbAKpWHu16Kh1dTP6G3va60pxly9pE_uWmCVNjivzZi2ByjumvlVuHwYdXzgBqU8bf8v4xBIXXAjV4x4J0vJnrzDKfJoQ2uCH70Yb00oDPj3yR2HEx8JcGzuWa8jzPH3sDxcga3JtUJg';
    let refreshToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1Njg2NTcwNn0.ltw_42e_Q7AvvC1GXoobZkyb6R3Xp3KZNotU0KAYTgUhikvltC0sq6XWcKZuGCombDaqCnSJ2e8OCsrkZazqEr_H-InQ8c1XOgf4O-28XGFvL3QO8Ftacd-_w9_NW45e1hfMQ40UvCBwRxVTvjwSvt_pItyciBxiPAxjlX2sbzmVdkywzKHqbwwcvKkJEZpFCRXz5N5ETO2qtD4ACSdQzC-2MbUB0EeYF5qHsBUsBZ8RJJ_rNO1eewRQgCDGoEzCCRQDn1GGrJeOchaOtMNegkLZvpyCfnYmCiATZuxeR5LP9lLmZK7QQSUVeJrzt_oQvSYHImTPsav5eqnd_JRzHw';
    let remember = true;
    let mockReturnSuccessData = {
      _id: '624c6d3f28330ecdfa7b62c5',
      email: 'thapakorn613@gmail.com',
      accessToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1NjM0NzMwNn0.m3l5hKdKrSjL6GP6DaUqL_lvhWIdmxyMkHTtCCyxxSyEUFLDFb99E3-Dv-ROCRqpRyppKAABdDNCt14n4lh9mjb7VdA4dnpRR_LKqr8gO4pTqD79cACJ-GsVfeO6F9CpaJlnx_NjkiuIU3nfIiaPJtZUSONQxQzjyzJTU2zMVCX_iaASibAAgXxbLCd04fBVk1Kz5zmfeMMbAKpWHu16Kh1dTP6G3va60pxly9pE_uWmCVNjivzZi2ByjumvlVuHwYdXzgBqU8bf8v4xBIXXAjV4x4J0vJnrzDKfJoQ2uCH70Yb00oDPj3yR2HEx8JcGzuWa8jzPH3sDxcga3JtUJg',
      refreshToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM2Yjg0MjU1YjMzMjBiZDE2NDI3MzUiLCJ1c2VybmFtZSI6ImFydHJvbmluMiIsImVtYWlsIjoidGhhcGFrb3JuNjEzQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IlN0cmluZyIsInRlYW1zIjpbIlFBIl0sImNyaXRlcmlhIjoiY3JpdGVyaWEiLCJsZXZlbCI6WyJxYUFnZW50Il0sInN0YXR1cyI6ImFjdGl2ZSIsImltYWdlIjoiU3RyaW5nIiwiX192IjowLCJpYXQiOjE2NTYyNjA5MDYsImV4cCI6MTY1Njg2NTcwNn0.ltw_42e_Q7AvvC1GXoobZkyb6R3Xp3KZNotU0KAYTgUhikvltC0sq6XWcKZuGCombDaqCnSJ2e8OCsrkZazqEr_H-InQ8c1XOgf4O-28XGFvL3QO8Ftacd-_w9_NW45e1hfMQ40UvCBwRxVTvjwSvt_pItyciBxiPAxjlX2sbzmVdkywzKHqbwwcvKkJEZpFCRXz5N5ETO2qtD4ACSdQzC-2MbUB0EeYF5qHsBUsBZ8RJJ_rNO1eewRQgCDGoEzCCRQDn1GGrJeOchaOtMNegkLZvpyCfnYmCiATZuxeR5LP9lLmZK7QQSUVeJrzt_oQvSYHImTPsav5eqnd_JRzHw',
      remember: true,
      createdAt: 1649175871,
      updatedAt: 1656260906,
      __v: 0,
    };
    UserRepository.timezone = 'Asia/Bangkok';
    jest.spyOn(dbUserAuthenModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    jest.spyOn(dbUserAuthenModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await UserRepository.updateTokenOfUser(email, accessToken, refreshToken, remember)).toEqual(mockReturnSuccessData);
  });
  test('Test update user token success', async () => {
    let mockReturnFindOne = {
      _id: '123456789012345678901234',
      email: 'test1@gmail.com',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      remember: true,
      createdAt: 1111111111,
      updatedAt: 2222222222,
      __v: 0,
    };
    let mockReturnUpdateOne = {
      email: 'test1@gmail.com',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      remember: true,
      updatedAt: 2222222222,
      __v: 0,
    };
    jest.spyOn(dbUserAuthenModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnFindOne),
    }));
    jest.spyOn(dbUserAuthenModel, 'updateOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(mockReturnUpdateOne),
    }));
    expect(await UserRepository.updateTokenOfUser()).toEqual(mockReturnUpdateOne);
  });
  test('Test error catch case', async () => {
    const mockInvalidData = undefined;
    jest.spyOn(dbUserAuthenModel, 'findOne').mockImplementationOnce(() => {
      return Promise.resolve(JSON.parse(mockInvalidData));
    });
    expect(await UserRepository.updateTokenOfUser('')).toEqual(false);
  });
});

describe('getrefresTokenData function', () => {
  test('Test get refresh token data success', async () => {
    let mockReturnSuccessData = {
      _id: '123456789012345678901234',
      email: 'test1@gmail.com',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      remember: true,
      createdAt: 1111111111,
      updatedAt: 2222222222,
      __v: 0,
    };
    jest.spyOn(dbUserAuthenModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await UserRepository.getrefresTokenData('accessToken')).toEqual(mockReturnSuccessData);
  });
  test('Test error catch case', async () => {
    let mockDataNotFound = null;
    jest.spyOn(dbUserAuthenModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockDataNotFound),
    }));
    expect(await UserRepository.getrefresTokenData(null)).toEqual(null);
  });
});

// describe('dropIndexs function', () => {
//   test('dropIndexes should remove image index from users collection', async () => {
//     let mockData = { acknowledged: true, deletedCount: 0 };
//     jest.spyOn(dbUserModel, 'remove').mockImplementationOnce(() => {
//       return Promise.resolve(mockData);
//     });
//     expect(await UserRepository.dropIndexs('')).toEqual(mockData);
//   });
//   test('dropIndexes should return false on error', async () => {
//     const mockInvalidData = undefined;
//     jest.spyOn(dbUserModel, 'remove').mockImplementationOnce(() => {
//       return Promise.resolve(mockInvalidData);
//     });
//     expect(await UserRepository.dropIndexs('')).toEqual(false);
//   });
// });
