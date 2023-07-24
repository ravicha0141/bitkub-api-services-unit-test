require('dotenv').config();
const { attachmentModel } = require('../../models');
const { getSignedUrl } = require('../../../services/s3.service');

class AttachmentRepository {
  constructor() {}

  async getStorageFileById(fileId) {
    return attachmentModel.findOne({ _id: fileId }).lean();
  }

  async getStorageFiles(filter) {
    return attachmentModel.find(filter).lean();
  }
  async getOneByFilter(filter) {
    return attachmentModel.findOne(filter).lean();
  }

  async getAllWithSignedUrl(filter) {
    return new Promise((resolve, reject) => {
      attachmentModel
        .find(filter)
        .lean()
        .then(async (fileList) => {
          if (fileList.length == 0) return resolve(fileList);

          const signedUrlList = await Promise.all(fileList.map((file) => getSignedUrl(file)));
          return resolve(fileList.map((file, inx) => (file.signedUrl = signedUrlList[inx])));
        })
        .catch((error) => reject(error));
    });
  }

  async createStorageFiles(dataBody, typeFile) {
    let tagForSplit = `bitqast-`;
    let dataForCreate = JSON.parse(JSON.stringify(dataBody));
    dataForCreate['fileName'] = `${tagForSplit}${dataBody['key']}`;
    dataForCreate['typeFile'] = typeFile;
    dataForCreate['sourceFile'] = `${dataBody['location'].split('.com')[1]}`;
    dataForCreate['uri'] = `${dataBody['location']}`;
    const schemData = new attachmentModel(dataForCreate);
    return await schemData.save();
  }

  async removeFileById(fileId) {
    return attachmentModel.findOneAndRemove({ _id: fileId });
  }
}

module.exports = AttachmentRepository;
