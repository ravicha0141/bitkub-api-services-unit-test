require('dotenv').config();
const { v4: uuid } = require('uuid');
const { createLogger, format, transports } = require('winston');

const logTransporters = [
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(
        (info) =>
          `${info.timestamp} ${info.level} ${info.message} ${info.data ? JSON.stringify(info.data, null, 2) : ''} ${
            info.debugMessage || ''
          }`,
      ),
    ),
  }),
];

const logger = createLogger({
  level: 'debug',
  format: format.json(),
  transports: String(process.env.DEBUG) === 'true' ? logTransporters : [new transports.Console()],
});

class LoggerServices {
  constructor(req, serviceName) {
    this.traceId = req['headers']['traceid'] || 'trackid-not-found';
    this.path = req['originalUrl'];
    this.method = req['method'];
    this.user = req['user'] || {};
    this.serviceName = serviceName || 'bitqast-service';
  }

  info(message) {
    const spanId = uuid().split('-').shift();
    let prefixMessage = `[${this.serviceName}] `;
    if ('username' in this.user) prefixMessage += `User ${this.user.username} `;
    const formatLog = {
      level: 'info',
      timestamp: new Date().toISOString(),
      traceId: this.traceId,
      spanId,
      serviceName: this.serviceName,
      message: prefixMessage + message,
      path: this.path,
      method: this.method,
      userId: this.user._id,
      userEmail: this.user.email,
    };
    logger.log(formatLog);
  }

  debug(message, data = {}) {
    const spanId = uuid().split('-').shift();
    let prefixMessage = `[${this.serviceName}] `;
    const formatLog = {
      level: 'debug',
      timestamp: new Date().toISOString(),
      traceId: this.traceId,
      spanId,
      serviceName: this.serviceName,
      message: prefixMessage + message,
      data,
      path: this.path,
      method: this.method,
      userId: this.user._id,
      userEmail: this.user.email,
    };
    logger.log(formatLog);
  }

  error(message, errorObj = {}) {
    const spanId = uuid().split('-').shift();
    let prefixMessage = `[${this.serviceName}] `;
    if ('username' in this.user) prefixMessage += `User ${this.user.username} `;
    const formatLog = {
      level: 'error',
      timestamp: new Date().toISOString(),
      traceId: this.traceId,
      spanId,
      serviceName: this.serviceName,
      message: prefixMessage + message,
      ...errorObj,
      path: this.path,
      method: this.method,
      userId: this.user._id,
      userEmail: this.user.email,
    };
    logger.log(formatLog);
  }

  critical(message, errorObj = {}) {
    const spanId = uuid().split('-').shift();
    let prefixMessage = `[${this.serviceName}] `;
    if ('username' in this.user) prefixMessage += `User ${this.user.username} `;
    const formatLog = {
      level: 'error',
      timestamp: new Date().toISOString(),
      traceId: this.traceId,
      spanId,
      serviceName: this.serviceName,
      message: prefixMessage + message,
      ...errorObj,
      path: this.path,
      method: this.method,
      userId: this.user._id,
      userEmail: this.user.email,
    };
    logger.log(formatLog);
  }
}

module.exports = { LoggerServices };
