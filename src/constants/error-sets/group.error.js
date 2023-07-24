const ErrorSetOfGroup = {
  BIQ_GRP_00: {
    errorCode: 'BIQ-GRP-00',
    errorMessage: 'Group service internal server error ',
  },
  BIQ_GRP_01: {
    errorCode: 'BIQ-GRP-01',
    errorMessage: 'group has already exists.',
  },
  BIQ_GRP_02: {
    errorCode: 'BIQ-GRP-02',
    errorMessage: 'group cannot create.',
  },
  BIQ_GRP_03: {
    errorCode: 'BIQ-GRP-03',
    errorMessage: 'group cannot create because some field was wrong.',
  },
  BIQ_GRP_04: {
    errorCode: 'BIQ-GRP-04',
    errorMessage: 'group cannot update because some field was wrong.',
  },
  BIQ_GRP_05: {
    errorCode: 'BIQ-GRP-05',
    errorMessage: 'group not found.',
  },
  BIQ_GRP_06: {
    errorCode: 'BIQ-GRP-06',
    errorMessage: 'group cannot delete.',
  },
  BIQ_GRP_07: {
    errorCode: 'BIQ-GRP-07',
    errorMessage: 'member of group cannot update because some field was wrong.',
  },
  BIQ_GRP_08: {
    errorCode: 'BIQ-GRP-08',
    errorMessage: 'member of group cannot create because some field was wrong.',
  },
  BIQ_GRP_09: {
    errorCode: 'BIQ-GRP-09',
    errorMessage: 'member has fail to join group.',
  },
  BIQ_GRP_10: {
    errorCode: 'BIQ-GRP-10',
    errorMessage: 'member has already join group.',
  },
  BIQ_GRP_11: {
    errorCode: 'BIQ-GRP-11',
    errorMessage: 'fail to delete this member from group.',
  },
  BIQ_GRP_12: {
    errorCode: 'BIQ-GRP-12',
    errorMessage: 'member not found.',
  },
  BIQ_GRP_13: {
    errorCode: 'BIQ-GRP-13',
    errorMessage: 'grade not found.',
  },
  BIQ_GRP_14: {
    errorCode: 'BIQ-GRP-14',
    errorMessage: 'grade has already exist in this group.',
  },
  BIQ_GRP_15: {
    errorCode: 'BIQ-GRP-15',
    errorMessage: 'payload of grade data was wrong.',
  },
};

module.exports = ErrorSetOfGroup;
