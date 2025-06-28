const express = require("express");
const router = express.Router();

// import all api routes
router.use("/auth", require("./auth.routes"));
router.use("/dingg-partner", require("./dingg.routes"));

// Exports
module.exports = router;
