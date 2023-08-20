require('dotenv').config();
const path = require('path');
const dirname = require('app-root-path');
/* const dbModels = require(path.resolve(`${dirname}/src/databases/models`));
const { attachmentRepository } = require(path.resolve(`${dirname}/src/databases/repositories/index`));

let dbAttachmentModel = dbModels.attachmentModel;
const AttachmentRepository = new attachmentRepository(); */

const { s3Service } = require(path.resolve(`${dirname}/src/s3storage-connection`));
const { attachmentModel } = require(path.resolve(`${dirname}/src/databases/models`));
const repositoriesDb = require(path.resolve(`${dirname}/src/databases/repositories`));
const AttachmentRepository = new repositoriesDb.attachmentRepository();

afterEach(() => {
  jest.restoreAllMocks();
});

let mockReturnSuccessData = {
  __v: 0,
  _id: '630d0ef3806854eff19955a1',
  bucket: 'bitqast-dev',
  createdAt: 1671723166,
  etag: '"c85db308a7dda50bb7e5137b49cb7d31"',
  fieldname: 'audio',
  fileName: 'bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  originalname: 'Test voice file small 1 copy 2.mp3',
  size: 3202408,
  sourceFile: '/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
  typeFile: 'voice-file',
  updatedAt: null,
  uri: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
};

describe('getStorageFileById function', () => {
  test('Test get Storage File By Id success', async () => {
    jest.spyOn(attachmentModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await AttachmentRepository.getStorageFileById()).toEqual(mockReturnSuccessData);
  });
});

describe('getStorageFiles function', () => {
  test('Test get Storage Files success', async () => {
    jest.spyOn(attachmentModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await AttachmentRepository.getStorageFiles()).toEqual(mockReturnSuccessData);
  });
});

describe('getOneByFilter function', () => {
  test('Test get One By Filter success', async () => {
    jest.spyOn(attachmentModel, 'findOne').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockReturnSuccessData),
    }));
    expect(await AttachmentRepository.getOneByFilter()).toEqual(mockReturnSuccessData);
  });
});

describe('getAllWithSignedUrl function', () => {
  
  test('Test get All With Signed Url success', async () => {
    const mockFileData = [
      {
        signedUrl: 'testSignedUrl',
        bucket: 'testSignedUrl',
        key: '',
        expires: 1
      },
      {
        signedUrl: 'testSignedUrl2',
        bucket: 'testSignedUrl2',
        key: '',
        expires: 1
      }
    ];
    const expectData = [ 'testSignedUrl','testSignedUrl2'];
    jest.spyOn(s3Service, 'getSignedUrl').mockImplementation((url, option) => {
      return option.Bucket;
    });
    jest.spyOn(attachmentModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockFileData),
    }));
    expect(await AttachmentRepository.getAllWithSignedUrl(mockFileData)).toEqual(expectData);
  });
  
  test('Test get All With Signed Url when fileList.length is 0', async () => {
    const mockEmptyFileData = [];
    jest.spyOn(attachmentModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockResolvedValue(mockEmptyFileData),
    }));
    expect(await AttachmentRepository.getAllWithSignedUrl(mockEmptyFileData)).toEqual(mockEmptyFileData);
  });
  test('Test get All With Signed Url when error', async () => {
    const mockFileData = false;
    jest.spyOn(attachmentModel, 'find').mockImplementationOnce(() => ({
      lean: jest.fn().mockRejectedValue(mockFileData),
    }));
    try {
      await AttachmentRepository.getAllWithSignedUrl(mockFileData)
    } catch (error) {
      expect(error).toEqual(mockFileData);
    }
  });
});

describe('createStorageFiles function', () => {
  test('Test get storage file success', async () => {
    let dataBody = {
      key: 'voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
      location: 'https://bitqast-dev.s3.ap-southeast-1.amazonaws.com/voices/2022-08-30/bitqast-e532298c-99f0-40b2-934a-ae1f09618313.mp3',
    };
    let typeFile = {
      typeFile: 'voice-file',
    };
    jest.spyOn(attachmentModel.prototype, 'save').mockImplementationOnce(() => {
      return Promise.resolve(mockReturnSuccessData);
    });
    expect(await AttachmentRepository.createStorageFiles(dataBody, typeFile)).toEqual(mockReturnSuccessData);
  });
});

describe('removeFileById function', () => {
  test('Test remove File By Id success', async () => {
    jest.spyOn(attachmentModel, 'findOneAndRemove').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    expect(await AttachmentRepository.removeFileById()).toEqual(true);
  });
});
