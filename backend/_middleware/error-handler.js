/**
 * The global error handler is used catch all errors and remove the need for duplicated error
 * handling code throughout the CRUD application. This is the final error handling route that
 * will ultimately send an error response back to the client. Since all server-side errors will
 * be run through this route
 */
const logger = require('_helpers/logger');

module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // - Write all logs with an importance level of `error` or less to `error.log`
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
