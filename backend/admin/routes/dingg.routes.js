/**
 * Define Users routes
 */
const express = require("express");
const router = express.Router();
const ROLES_LIST = require('_config/roles_list');
const ipHandler = require("_middleware/ipHandler");
const verifyToken = require("_middleware/verify-token");
const getToken = require("_middleware/get-token");
const controllers = require("../controllers/dingg.controller");
const schema = require("../validate_schema/dingg.schema");
const uploadImageSingle = require("../../_middleware/upload-image");

// API routes
router.get("/get-locations", controllers.getLocations);
router.get("/get-services/:businessId", controllers.getServices);
router.get("/get-operators/:businessId", controllers.getOperators);
router.get("/get-business-hours/:businessId", controllers.getBusinessHours);
router.post("/get-slots/:businessId", schema.getSlots, controllers.getSlots);
router.post("/create-booking", schema.createBooking, controllers.createBooking);
router.post("/get-user-bookings", schema.getUserBookings, controllers.getUserBookings);
router.post("/cancel-booking", schema.cancelBooking, controllers.cancelBooking);

module.exports = router;
