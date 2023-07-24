const ErrorSetOfAuthorization = {
  BIQ_ATZ_01: {
    errorCode: 'BIQ-ATZ-01',
    errorMessage: 'Service require Bearer access-token.',
  },
  BIQ_ATZ_02: {
    errorCode: 'BIQ-ATZ-02',
    errorMessage: 'Authentication required.',
  },
  BIQ_ATZ_03: {
    errorCode: 'BIQ-ATZ-03',
    errorMessage: 'Service require Bearer access-token for data and require BasicToken for authentication.',
  },
  BIQ_ATZ_04: {
    errorCode: 'BIQ-ATZ-04',
    errorMessage: 'Access token has expired or is not yet valid.',
  },
};

module.exports = ErrorSetOfAuthorization;
