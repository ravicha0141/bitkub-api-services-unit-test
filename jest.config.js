module.exports = {
  maxWorkers: '50%',
  collectCoverage: true,
  coverageReporters: ['html'],
  testPathIgnorePatterns: ['/node_modules/'],
  reporters: ['default', ['jest-summary-reporter', { type: 'total' }]],
};