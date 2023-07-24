const apiMetrics = require('prometheus-api-metrics');

const MetricsMiddleware = apiMetrics();

module.exports = MetricsMiddleware;
