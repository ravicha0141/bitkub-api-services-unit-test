const { v4: uuid } = require('uuid');
const TransactionMiddleware = async (req, res, next) => {
  req['traceId'] = uuid();
  return next();
};
module.exports = { TransactionMiddleware };
