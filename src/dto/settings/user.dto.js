module.exports = {
  getUserListQueryDTO: (doc) => {
    const filter = {};
    if ('username' in doc) filter.username = doc.username;
    if ('email' in doc) filter.email = new RegExp(doc.email, 'i');
    if ('level' in doc) filter.level = Array.isArray(doc.level) ? { $in: doc.level } : doc.level;
    if ('status' in doc) filter.status = doc.status;
    if ('type' in doc) filter.type = doc.type;
    return filter;
  },
  updateUserDTO: (doc) => {
    const filter = {};
    if ('username' in doc) filter.username = doc.username;
    if ('level' in doc) filter.level = Array.isArray(doc.level) ? { $in: doc.level } : doc.level;
    if ('imageId' in doc) filter.imageId = doc.imageId;
    if ('signatureId' in doc) filter.signatureId = doc.signatureId;
    if ('status' in doc) filter.status = doc.status;
    return filter;
  },
};
