const ErrorSetOfSettingUsers = {
  BIQ_USR_00: {
    errorCode: 'BIQ-USR-00',
    errorMessage: 'Setting user internal server error.',
  },
  BIQ_USR_01: {
    errorCode: 'BIQ-USR-01',
    errorMessage: 'user not found.',
  },
  BIQ_USR_02: {
    errorCode: 'BIQ-USR-02',
    errorMessage: 'payload for create user was wrong.',
  },
  BIQ_USR_03: {
    errorCode: 'BIQ-USR-03',
    errorMessage: 'user has already exists.',
  },
  BIQ_USR_04: {
    errorCode: 'BIQ-USR-04',
    errorMessage: 'payload for update user was wrong.',
  },
  BIQ_USR_05: {
    errorCode: 'BIQ-USR-05',
    errorMessage: 'Callback payload invalid.',
  },
  BIQ_USR_06: {
    errorCode: 'BIQ-USR-06',
    errorMessage: 'Callback response from SSO invalid.',
  },
  BIQ_USR_07: {
    errorCode: 'BIQ-USR-07',
    errorMessage: 'Can not create user for SSO.',
  },
  BIQ_USR_08: {
    errorCode: 'BIQ-USR-08',
    errorMessage: 'Can not create user.',
  },
};

module.exports = ErrorSetOfSettingUsers;
