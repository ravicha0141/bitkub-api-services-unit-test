const ErrorSetOfAuth = {
  BIQ_AUT_00: {
    errorCode: 'BIQ-AUT-00',
    errorMessage: 'Authentication internal service error.',
  },
  BIQ_AUT_01: {
    errorCode: 'BIQ-AUT-01',
    errorMessage: 'user not found.',
  },
  BIQ_AUT_02: {
    errorCode: 'BIQ-AUT-02',
    errorMessage: 'user is deactive, Please contact admin.',
  },
  BIQ_AUT_03: {
    errorCode: 'BIQ-AUT-03',
    errorMessage: 'invalid username or password.',
  },
  BIQ_AUT_04: {
    errorCode: 'BIQ-AUT-04',
    errorMessage: 'Invalid password.',
  },
  BIQ_AUT_05: {
    errorCode: 'BIQ-AUT-05',
    errorMessage: 'Invalid password for 3 times Please contact to Admin.',
  },
  BIQ_AUT_06: {
    errorCode: 'BIQ-AUT-06',
    errorMessage: 'payload for signin was wrong.',
  },
  BIQ_AUT_07: {
    errorCode: 'BIQ-AUT-07',
    errorMessage: 'payload for get token was wrong.',
  },
  BIQ_AUT_08: {
    errorCode: 'BIQ-AUT-08',
    errorMessage: 'Refresh token not found.',
  },
  BIQ_AUT_09: {
    errorCode: 'BIQ-AUT-09',
    errorMessage: 'Refresh token not allow.',
  },
};
module.exports = ErrorSetOfAuth;
