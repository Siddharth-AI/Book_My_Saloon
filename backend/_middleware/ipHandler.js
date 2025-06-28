/**
 * The global ip handler is used catch user request ip
 * ::ffff: is a subnet prefix for IPv4 (32 bit) addresses that are placed inside an IPv6 (128 bit)
 * space. IPv6 is broken into two parts, the subnet prefix, and the interface suffix.
 * remove ::ffff: from reqest ip
 */
module.exports = (req, res, next) => {
    var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7)
    }
    req.clientIp = clientIp;
    next();
};