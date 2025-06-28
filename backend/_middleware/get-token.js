/**
 * A get token handler that help to validate incomming token
 */

const jwt = require("jsonwebtoken");
const config = process.env;

module.exports = getToken;

function getToken(req, res, next) {
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
    if (bearerToken) {
      req.auth_params = {
        token: bearerToken
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
}
