const request = require('supertest');
const express = require('express');
const app = express();
const path = require('path');
const dirname = require('app-root-path');

const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const authenticationController = require(path.resolve(`${dirname}/src/controllers/authentications.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const GroupRepository = new repositoriesDb.groupRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();
let router = authenticationController({
  userRepository: UserRepository,
  groupRepository: GroupRepository,
  memberRepository: MemberRepository,
  attachmentRepository: AttachmentRepository,
  auditlogRepository: AuditlogRepository,
});

const { userAuthenModel } = require(path.resolve(`${dirname}/src/databases/models`));


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test on medthod POST /signin', () => {
  test('return status code 400, payload for signin was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 401, user not found', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 401, user is deactive, Please contact admin', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockUsersDbServicesData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'deactive',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockUsersDbServicesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 401, Invalid password for 3 times Please contact to Admin', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
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
    let mockInvalidPassword3TimesData = {
      __v: 0,
      _id: '63a1e3644ddb8ade78ad977e',
      count: 3,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: null,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'increaseRequestSignIn').mockImplementationOnce(async () => {
      return Promise.resolve(mockInvalidPassword3TimesData);
    });
    jest.spyOn(await UserRepository, 'setRequestSignInDeactive').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 401, user is deactive, Please contact admin', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
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
    let mockInvalidPassword4TimesData = {
      __v: 0,
      _id: '63a1e3644ddb8ade78ad977e',
      count: 4,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: null,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'increaseRequestSignIn').mockImplementationOnce(async () => {
      return Promise.resolve(mockInvalidPassword4TimesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 401, Invalid password', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
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
    let mockInvalidPassword2TimesData = {
      __v: 0,
      _id: '63a1e3644ddb8ade78ad977e',
      count: 2,
      createdAt: 1671553891,
      email: 'test1234@gmail.com',
      updatedAt: null,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'increaseRequestSignIn').mockImplementationOnce(async () => {
      return Promise.resolve(mockInvalidPassword2TimesData);
    });
    jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 401, accessTokenData Invalid password', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'unlock',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'getAccessToken').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 200', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'unlock',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    let mockStorageFilesServicesData = {
      __v: 'data __v',
      _id: 'data _id',
      bucket: 'data bucket',
      etag: 'data etag',
      fieldname: 'data fieldname',
      fileName: 'data fileName',
      key: 'data key',
      location: 'data location',
      originalname: 'data originalname',
      size: 'data size',
      sourceFile: 'data sourceFile',
      typeFile: 'data typeFile',
      uri: 'data uri',
    };
    let mockMemberServicesData = {
      __v: 0,
      _id: '631662a4f55f573399f8dc22',
      createdAt: 1671720365,
      email: 'bitkubagent1@bitkub.com',
      groupId: '630ceb60fdd0d440c056e3c0',
      name: 'bitkubagent3',
      role: 'qaAgent',
      updatedAt: null,
      userId: '624fe297790139ea1d6885c7',
    };
    let mockGroupsDbServicesData = {
      __v: 0,
      _id: '63a32c76a934f7bb58bf566d',
      createdAt: 1671637864,
      name: 'Test authority 1',
      tag: 'testauthority1',
      updatedAt: null,
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'getAccessToken').mockImplementationOnce(async () => {
      return Promise.resolve('Success');
    });
    jest.spyOn(await AttachmentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockStorageFilesServicesData);
    });
    jest.spyOn(await AttachmentRepository, 'getOneByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockStorageFilesServicesData);
    });
    jest.spyOn(await MemberRepository, 'getOneWithFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockMemberServicesData);
    });
    jest.spyOn(await GroupRepository, 'getGroupById').mockImplementationOnce(async () => {
      return Promise.resolve(mockGroupsDbServicesData);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 500 /signin', async () => {
    let mockReq = {
      remember: false,
      email: 'john.doe@example.com',
      password: 'password123',
    };
    let mockGetUsersDbServicesData = {
      __v: 0,
      _id: '6236b84255b3320bd1642735',
      createdAt: 1662832593,
      email: 'thapakorn613@gmail.com',
      imageId: '630240d5540c633bf2fc1f0a',
      level: 'qaAgent',
      password: '$2a$08$fOrbAqDuz6TPBmm0Tg0Kseom1I5ATM6vp3WYyHvomK6z2IBTk2ykm',
      signatureId: '630a04f3ae2bd31df3a6dd39',
      status: 'unlock',
      telephone: 'String',
      type: 'SSO_AUTHEN',
      updatedAt: null,
      username: 'artronin2',
    };
    jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetUsersDbServicesData);
    });
    jest.spyOn(await UserRepository, 'getAccessToken').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/signin').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
  // test('case signin-successfully /signin', async () => {
  //   let mockReq = {
  //     remember: false,
  //     email: 'john.doe@example.com',
  //     password: '',
  //   };
  //   let mockGetUsersDbServicesData = {
  //     __v: 0,
  //     _id: '6236b84255b3320bd1642735',
  //     createdAt: 1662832593,
  //     email: 'thapakorn613@gmail.com',
  //     imageId: '630240d5540c633bf2fc1f0a',
  //     level: 'qaAgent',
  //     password: '',
  //     signatureId: '630a04f3ae2bd31df3a6dd39',
  //     status: 'active',
  //     telephone: 'String',
  //     type: 'SSO_AUTHEN',
  //     updatedAt: null,
  //     username: 'artronin2',
  //   };
  //   jest.spyOn(await UserRepository, 'getOneUserByFilterWithPassword').mockImplementationOnce(async () => {
  //     return Promise.resolve(mockGetUsersDbServicesData);
  //   });
  //   jest.spyOn(await AuditlogRepository, 'create').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   jest.spyOn(await UserRepository, 'updateUserByObject').mockImplementationOnce(async () => {
  //     return Promise.resolve('Success');
  //   });
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use('/', router);
  //   let response = await request(app).post('/signin').send(mockReq);
  //   expect(response.statusCode).toEqual(500);
  // });
});

describe('Test on medthod POST /token', () => {
  test('return status code 400, payload for get token was wrong', async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/token');
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 400, Refresh token not found', async () => {
    let mockReq = {
      refreshToken: 'refreshToken',
    };
    jest.spyOn(await UserRepository, 'getrefresTokenData').mockImplementationOnce(async () => {
      return Promise.resolve('');
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/token').send(mockReq);
    expect(response.statusCode).toEqual(400);
  });
  test('return status code 200', async () => {
    let mockReq = {
      refreshToken: 'refreshToken',
    };
    let mockGetrefresTokenData = {
      _id: '123456789012345678901234',
      email: 'test1@gmail.com',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      remember: true,
      createdAt: 1111111111,
      updatedAt: 2222222222,
      __v: 0,
    };
    let mockGetOneUserByFilter = {
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
    let mockUpdateTokenOfUser = {
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
    jest.spyOn(await UserRepository, 'getrefresTokenData').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetrefresTokenData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetOneUserByFilter);
    });
    jest.spyOn(await userAuthenModel, 'findOne').mockImplementationOnce(async () => {
      return Promise.resolve(mockUpdateTokenOfUser);
    });
    jest.spyOn(await userAuthenModel, 'updateOne').mockImplementationOnce(async () => {
      return Promise.resolve(mockUpdateTokenOfUser);
    });
    
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/token').send(mockReq);
    expect(response.statusCode).toEqual(200);
  });
  test('return status code 401', async () => {
    let mockReq = {
      refreshToken: 'refreshToken',
    };
    let mockGetrefresTokenData = {
      _id: '123456789012345678901234',
      email: 'test1@gmail.com',
      accessToken: false,
      refreshToken: false,
      remember: false,
      createdAt: 1111111111,
      updatedAt: 2222222222,
      __v: 0,
    };
    let mockGetOneUserByFilter = {
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
    jest.spyOn(await UserRepository, 'getrefresTokenData').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetrefresTokenData);
    });
    jest.spyOn(await UserRepository, 'getOneUserByFilter').mockImplementationOnce(async () => {
      return Promise.resolve(mockGetOneUserByFilter);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/token').send(mockReq);
    expect(response.statusCode).toEqual(401);
  });
  test('return status code 500', async () => {
    let mockReq = {
      refreshToken: 'refreshToken',
    };
    let mockGetrefresTokenData = {
      _id: '123456789012345678901234',
      email: 'test1@gmail.com',
      accessToken: false,
      refreshToken: false,
      remember: false,
      createdAt: 1111111111,
      updatedAt: 2222222222,
      __v: 0,
    };
    jest.spyOn(await UserRepository, 'getrefresTokenData').mockImplementationOnce(async () => {
      return Promise.reject(false);
    });
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);
    let response = await request(app).post('/token').send(mockReq);
    expect(response.statusCode).toEqual(500);
  });
});
