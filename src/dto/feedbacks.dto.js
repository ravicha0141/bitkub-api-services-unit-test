module.exports = {
  TransferResultDataForCriteriaKycDto: (doc) => {
    return {
      formId: doc._id,
      trackType: doc.trackType,
      name: doc.name,
      targetScore: doc.targetScore,
      arrayColumnValues: doc.arrayColumnValues,
      listResultsData: doc.listResultsData,
    };
  },
  TransferQuestionForCriteriaKycDto: (doc) => {
    return {
      questionTitle: doc.title,
      questionWeight: doc.weight,
      results: doc.itemLists,
    };
  },
  TransferItemForCriteriaKycDto: (doc) => {
    return {
      order: doc.order,
      referTitle: doc.title,
      values: doc.values,
    };
  },
};
