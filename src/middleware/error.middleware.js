const ErrorMiddleware = (error, req, res, next) => {
  if (error) {
    if (error.message === 'Not allowed by CORS') {
      return res.status(403).json({ errorCode: 'BQT-ER-01', errorMessage: 'Not allowed by CORS' });
    } else if (error?.message === 'invalid csrf token') {
      return res.status(403).json({ errorCode: 'BQT-ER-02', errorMessage: 'Invalid csrf token' });
    }
    const statusCode = res.statusCode || 500;
    if (statusCode !== 500) {
      if (typeof error.message === 'string') {
        return res.status(statusCode).json({ errorCode: 'BQT-ER-00', errorMessage: error.message });
      }
      return res.status(statusCode).json(JSON.parse(error.message));
    }
    return res.status(500).json({ errorCode: 'BQT-ER-00', errorMessage: 'Internal Server Error' });
  }
  next();
};
module.exports = { ErrorMiddleware };
