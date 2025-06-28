/**
 * Logs are a simple way of persisting data about your application so you can view this data
 * for analysis later.
 */
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

// define the custom settings for each transport (file, console)
var options = {
  combinedFile: {
    level: 'info',
    filename: path.join('logs', 'combined.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false,
  },
  errorFile: {
    level: 'error',
    filename: path.join('logs', 'error.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
module.exports = createLogger({
  format: combine(
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    json()
  ),
  transports: [
    // - Write all logs with an importance level of `error` or less to `error.log`
    new transports.File(options.errorFile),
    // - Write all logs with an importance level of `combined` or less to `combined.log`
    new transports.File(options.combinedFile),
    // - Write all logs to `console.log`
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
