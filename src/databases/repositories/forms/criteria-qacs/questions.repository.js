require('dotenv').config();
const moment = require('moment-timezone');
const { criteriaQacsQuestionModel } = require('../../../models');
class CriteriaQaCsQuestionRepository {
  constructor() {
    this.yearConvert = 543;
    this.yearModerate = 100;
  }

  async getListOfQuestionsByFilter(filter) {
    return criteriaQacsQuestionModel
      .find(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return false;
      });
  }

  async getOneQuestionsWithFilter(filter) {
    return criteriaQacsQuestionModel
      .findOne(filter)
      .then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
      .catch(() => {
        return null;
      });
  }

  async createQuestionOfForm(formId, dataBody) {
    try {
      const dataForCreate = {
        ...dataBody,
        formId: formId,
      };
      const schemData = new criteriaQacsQuestionModel(dataForCreate);
      return await schemData.save();
    } catch (error) {
      let errorReturn = JSON.parse('{}');
      errorReturn['code'] = `errorIn-CreateForm`;
      errorReturn['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify({ error: errorReturn }));
    }
  }

  async updateQuestionFormByIdWithObject(questionId, dataForUpdate) {
    let returnData = JSON.parse('{}');
    try {
      if (criteriaQacsQuestionModel.findById(questionId).exec()) {
        criteriaQacsQuestionModel
          .findByIdAndUpdate(
            questionId,
            {
              ...dataForUpdate,
              updatedAt: moment().tz('Asia/Bangkok').unix(),
            },
            {
              upsert: true,
            },
          )
          .exec();
        return JSON.parse(JSON.stringify(dataForUpdate));
      } else
        return JSON.parse(
          JSON.stringify({
            error: {
              code: `questionFormNotFound`,
              message: `${questionId} is not found.`,
            },
          }),
        );
    } catch (error) {
      returnData['code'] = `errorInUpdateGroupByFilter`;
      returnData['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify({ error: returnData }));
    }
  }

  async deleteQuestionOfForm(questionId) {
    try {
      let deleteOne = await criteriaQacsQuestionModel.deleteOne({ _id: questionId });
      if (deleteOne['deletedCount'] > 0) return true;
      else return false;
    } catch (error) {
      let errorReturn = JSON.parse('{}');
      errorReturn['code'] = `errorIn-DeleteForm`;
      errorReturn['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify({ error: errorReturn }));
    }
  }
}

module.exports = CriteriaQaCsQuestionRepository;
