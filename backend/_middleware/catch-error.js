/**
 * The global catch error is used catch all errors throughout the CRUD application.
 */
module.exports = (err) => {
    let message = err;
    if (err.name && err.name === 'SequelizeDatabaseError') {
        message = 'This is embarrassing. An error has occurred. Please check the log for details.';
        if (process.env.NODE_ENV === 'development') {
            message = err;
        }
    }
    return [{
        'label': 'error',
        'message': message
    }]
}