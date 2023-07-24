const HealthCheckMiddleware = async (req, res, next) => {
  const _path = req['path'];
  if (_path === '/health') {
    const healtyCheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: 'ok',
      timestamp: Date.now(),
    };
    return res.status(200).json(healtyCheck);
  }
  next();
};

module.exports = { HealthCheckMiddleware };
