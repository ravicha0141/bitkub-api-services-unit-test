module.exports = {
  createTemplateDTO: (doc) => {
    return {
      title: doc.title,
      targetScore: doc.targetScore,
      trackType: doc.trackType,
      properties: doc.properties,
    };
  },
  updateTemplateDTO: (doc) => {
    return {
      title: doc.title,
      targetScore: doc.targetScore,
      properties: doc.properties,
    };
  },
  createQuestionOfTemplateDTO: (doc) => {
    return {
      templateId: doc.templateId,
      title: doc.title,
      detail: doc.detail,
      weight: doc.weight,
      properties: doc.properties,
    };
  },
  updateQuestionOfTemplateDTO: (doc) => {
    return {
      title: doc.title,
      detail: doc.detail,
      weight: doc.weight,
      properties: doc.properties,
    };
  },
  createItemOfTemplateDTO: (doc) => {
    return {
      templateId: doc.templateId,
      questionId: doc.questionId,
      title: doc.title,
      detail: doc.detail,
      weight: doc.weight,
      properties: doc.properties,
    };
  },
  updateItemOfTemplateDTO: (doc) => {
    return {
      title: doc.title,
      detail: doc.detail,
      weight: doc.weight,
      properties: doc.properties,
    };
  },
};
