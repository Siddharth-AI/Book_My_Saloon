/**
 * Custom API Response handler
 * Take 4 arguments -
 * 1 - Response object
 * 2 - For displaying appropriate messages for which action is performed
 * 3 - For checking if the error has occurred or not
 * 4 - Data sent to user
 */
const logger = require('_helpers/logger');
module.exports = (req, res, message, status = false, data=null) => {
    let resObject = {
        status: status,
        message: message,
        fromCache: false,
    };

    if (status) {
        if (data) {
            //console.log(data.total,"<<==data==");
            if (data.total){
                resObject['data'] = data.data;
                resObject['total'] = data.total;
            }else{
                resObject['data'] = data;
            }
        }
        logger.info(message, {
            status: 200,
            method: req.method,
            service: req.originalUrl,
            ip_address: req.ip,
        });
    } else {
        logger.error(message, {
            status: 401,
            method: req.method,
            service: req.originalUrl,
            ip_address: req.ip,
        });
    }

    return res.status(200).json(resObject).end();
};
