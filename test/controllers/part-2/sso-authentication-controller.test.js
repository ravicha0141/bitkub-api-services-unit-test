const request = require('supertest');
const express = require('express');
let app;
const path = require('path');
const dirname = require('app-root-path');
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const SsoAuthenticationController = require(path.resolve(`${dirname}/src/controllers/sso-authentication.controller.js`));
const UserRepository = new repositoriesDb.userRepository();
const AttachmentRepository = new repositoriesDb.attachmentRepository();
const GroupRepository = new repositoriesDb.groupRepository();
const MemberRepository = new repositoriesDb.memberRepository();
const AuditlogRepository = new repositoriesDb.auditlogRepository();

let router = SsoAuthenticationController({
  passport: {
    authenticate: jest.fn(() => (req, res, next) => {
      req.user = {
        nameID: 'test@bitkub.com',
        _id: '63dbe3a54ea1e9fd12af8195'
      };
      next();
    }),
  },
  userRepository: UserRepository,
  attachmentRepository: AttachmentRepository,
  groupRepository: GroupRepository,
  memberRepository: MemberRepository,
  auditlogRepository: AuditlogRepository,
});

beforeEach(() => {
  app = express();
  app.use((req, res, next) => {
    req.isAuthenticated = jest.fn().mockReturnValue(true);
    req.session = {
      passport:{
        user: {
          nameID: 'test@bitkub.com',
          _id: '63dbe3a54ea1e9fd12af8195'
        }
      }
    };
    next();
  });
  app.use(express.json());
  app.use('/', router);
});


afterEach(() => {
  jest.clearAllMocks();
});

describe('Test on medthod GET /me', () => {
  test('return status code 200 when userData has a value', async () => {
    const mockUserData = {
      _id: '63dbe3a54ea1e9fd12af8195',
      email: 'test@example.com'
    };
    const mockMemberData = {
      groupId: 'testGroupId',
      _id: 'testId'
    };
    jest.spyOn(UserRepository, 'getOneUserByFilter').mockResolvedValueOnce(mockUserData);
    jest.spyOn(AuditlogRepository, 'create').mockResolvedValueOnce();
    jest.spyOn(UserRepository, 'getAccessToken').mockResolvedValueOnce({
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
    });
    jest.spyOn(AttachmentRepository, 'getOneByFilter').mockReturnValue('test');
    jest.spyOn(MemberRepository, 'getOneWithFilter').mockResolvedValueOnce(mockMemberData);
    jest.spyOn(GroupRepository, 'getGroupById').mockResolvedValueOnce({ name: 'testGroupName' });
    const response = await request(app).get('/me');
    expect(response.status).toBe(200);
  });
  test('return status code 401', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.isAuthenticated = jest.fn().mockReturnValue(false);
      next();
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).get('/me');
    expect(response.status).toBe(401);
  });
  test('return status code 400 when passport user has no value', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.isAuthenticated = jest.fn().mockReturnValue(true);
      req.session = {
        passport:{
          user: false
        }
      };
      next();
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).get('/me');
    expect(response.status).toBe(400);
  });
  test('return status 200 when userData has no value', async () => {
    jest.spyOn(UserRepository, 'getOneUserByFilter').mockResolvedValueOnce(false);
    jest.spyOn(UserRepository, 'createAndCheckDup').mockResolvedValueOnce({ userId: 'testUserId'});
    jest.spyOn(UserRepository, 'getAccessToken').mockResolvedValueOnce({
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).get('/me');
    expect(response.status).toBe(200);
  });
  test('return status 400 when profile has no value', async () => {
    jest.spyOn(UserRepository, 'getOneUserByFilter').mockResolvedValueOnce(false);
    jest.spyOn(UserRepository, 'createAndCheckDup').mockResolvedValueOnce(false);
    jest.spyOn(UserRepository, 'getAccessToken').mockResolvedValueOnce({
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
    });
    const response = await request(app).get('/me');
    expect(response.status).toBe(400);
  });

  test('return status code 400 when userEmail is not an email format', async () => {
    jest.spyOn(UserRepository, 'getOneUserByFilter').mockResolvedValueOnce(false);
    jest.spyOn(UserRepository, 'createAndCheckDup').mockResolvedValueOnce(false);
    jest.spyOn(UserRepository, 'getAccessToken').mockResolvedValueOnce({
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
    });
    const app = express();
    app.use((req, res, next) => {
      req.isAuthenticated = jest.fn().mockReturnValue(true);
      req.session = {
        passport:{
          user: {
            nameID: 'invalidemail',
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'invalidemail'
          }
        }
      };
      next();
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).get('/me');
    expect(response.status).toBe(400);
  });
});

describe('Test on medthod GET /login', () => {
  test('return status code 302', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(302);
  });
});

describe('Test on medthod POST /callback', () => {
  test('return status code 302', async () => {
    const response = await request(app).post('/callback');
    expect(response.status).toBe(302);
  });
});

describe('Test on medthod POST /logout', () => {
  test('return status code 200 with logoutUrl', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.clearCookie = jest.fn();
      req.session = {
        destroy: jest.fn()
      };
      req.logout = jest.fn();
      next();
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).post('/logout');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('logoutUrl');
  });
  test('return status code 200 without logoutUrl', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.clearCookie = jest.fn();
      next();
    });
    app.use(express.json());
    app.use('/', router);
    const response = await request(app).post('/logout');
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('logoutUrl');
  });
});