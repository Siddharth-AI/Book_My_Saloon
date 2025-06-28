/**
 * A verify token handler that help to validate incomming token
 */

const jwt = require("jsonwebtoken");
const config = process.env;

module.exports = verifyToken;

function verifyToken(req, res, next) {
  // Get authorization token
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    res.status(403).json({
      status: false,
      message: 'Please provide a valid "Bearer Token"!',
    });
  } else {
    // Validate bearer token
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, config.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: "Unauthorized! Access Token was expired!",
          is_expire: true,
        });
      } else {
        var dateNow = new Date();
        const { exp } = decoded; //roleId, userId, adminId in decoded
        if (exp < dateNow.getTime()) {
          req.auth_params = {
            role_id: decoded.roleId,
            user_id: decoded.userId,
            admin_id: (decoded.adminId)? decoded.adminId : 0,
            admin_code: (decoded.adminCode)? decoded.adminCode : ""
          };
          next();
        } else {
          res.status(401).json({
            status: false,
            message: "Unauthorized! Access Token was expired!",
            is_expire: true,
          });
        }
      }
    });
  }
}
