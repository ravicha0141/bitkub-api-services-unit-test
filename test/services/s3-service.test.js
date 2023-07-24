const path = require('path');
const dirname = require('app-root-path');
const { s3Service } = require(path.resolve(`${dirname}/src/s3storage-connection`));
const {
  getSignedUrl,
  uploadImageFile,
  uploadAudioFile,
  fileFilterImage,
  fileFilterAudioFile,
} = require(path.resolve(`${dirname}/src/services/s3.service`));

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fileFilterImage', () => {
  test('should return true', async () => {
    expect(fileFilterImage('image/jpeg')).toBe(true);
  });
  test('should return false', async () => {
    expect(fileFilterImage()).toBe(false);
  });
});

describe('fileFilterAudioFile', () => {
  test('should return true', async () => {
    expect(fileFilterAudioFile('audio/mp3')).toBe(true);
  });
  test('should return false', async () => {
    expect(fileFilterAudioFile()).toBe(false);
  });
});

describe('getSignedUrl', () => {
  test('should return signed URL', async () => {
    expect(await getSignedUrl({})).not.toBe(null);
  });
  test('should return null', async () => {
    jest.spyOn(s3Service, 'getSignedUrl').mockImplementationOnce(() => {
      throw new Error('Mock error');
    });
    expect(await getSignedUrl({})).toBe(null);
  });
});

describe('uploadImageFile', () => {
  const mockFileData = {
    originalname: 'image.jpg',
    buffer: 'test',
    mimetype: 'image/jpeg'
  };
  test('should upload image file', async () => {
    const mockUploadData = { mockUploadData: true };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      expect(params.ContentType).toEqual(mockFileData.mimetype);
      callback(null, mockUploadData);
    });
    const uploadData = await uploadImageFile(mockFileData, mockFileData.mimetype);
    expect(uploadData).toEqual(mockUploadData);
    expect(s3Service.upload).toHaveBeenCalledTimes(1);
  });
  test('should handle error', async () => {
    const mockError = new Error('Upload failed');
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      expect(params.ContentType).toEqual(mockFileData.mimetype);
      callback(mockError, null);
    });
    try {
      await uploadImageFile(mockFileData, mockFileData.mimetype);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
    expect(s3Service.upload).toHaveBeenCalledTimes(1);
  });
});
describe('uploadAudioFile', () => {
  const mockFileData = {
    originalname: 'audio.mp3',
    buffer: 'test',
    mimetype: 'audio/mp3'
  };
  test('should upload image file', async () => {
    const mockUploadData = { mockUploadData: true };
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      expect(params.ContentType).toEqual(mockFileData.mimetype);
      callback(null, mockUploadData);
    });
    const uploadData = await uploadAudioFile(mockFileData, mockFileData.mimetype);
    expect(uploadData).toEqual(mockUploadData);
    expect(s3Service.upload).toHaveBeenCalledTimes(1);
  });
  test('should handle error', async () => {
    const mockError = new Error('Upload failed');
    jest.spyOn(s3Service, 'upload').mockImplementationOnce((params, callback) => {
      expect(params.ContentType).toEqual(mockFileData.mimetype);
      callback(mockError, null);
    });
    try {
      await uploadAudioFile(mockFileData, mockFileData.mimetype);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
    expect(s3Service.upload).toHaveBeenCalledTimes(1);
  });
});