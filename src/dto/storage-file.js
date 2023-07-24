module.exports = {
  dataForUploadFileDTO: (doc) => {
    return {
      originalname: doc.originalname,
      mimetype: doc.mimetype,
      buffer: doc.buffer,
    };
  },
  createAttachmentFileDTO: (doc) => {
    return {
      key: doc.Key || '',
      location: doc.Location,
      uri: doc.Location,
      fieldname: doc.fieldname,
      originalname: doc.originalname,
      size: doc.size,
      bucket: doc.Bucket,
      etag: doc.Etag || '',
    };
  },
};
