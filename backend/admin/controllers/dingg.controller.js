/**
 * The auth controller defines all routes for the Node.js + MySQL CRUD API
 */
const responseHandler = require("_middleware/response-handler");
const service = require("../services/dingg.service");
const msg = require("_config/message.json");
const s3Upload = require("_middleware/s3Upload");

module.exports = {
    getLocations,
    getServices,
    getOperators,
    getBusinessHours,
    getSlots,
    createBooking,
    getUserBookings,
    cancelBooking
};

//Get Locations
async function getLocations(req, res, next) {
    service
        .getLocations()
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}
//Get Services
async function getServices(req, res, next) {
    service
        .getServices(req.params.businessId)
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Get Operators
async function getOperators(req, res, next) {
    service
        .getOperators(req.params.businessId)
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Get Hours
async function getBusinessHours(req, res, next) {
    service
        .getBusinessHours(req.params.businessId)
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Get Slots
async function getSlots(req, res, next) {
    service
        .getSlots(req.params.businessId, req.body)
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Create Booking
async function createBooking(req, res, next) {
    const userToken = req.headers['authorization'];
    if (!userToken) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .createBooking(req.body, userToken)
        .then((result) => responseHandler(req, res, msg.record_created, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Get User Bookings
async function getUserBookings(req, res, next) {
    const userToken = req.headers['authorization'];
    if (!userToken) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .getUserBookings(req.body, userToken)
        .then((result) => responseHandler(req, res, msg.record_found, true, result))
        .catch((error) => responseHandler(req, res, error));
}

//Cancel Booking
async function cancelBooking(req, res, next) {
    const userToken = req.headers['authorization'];
    if (!userToken) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .cancelBooking(req.body, userToken)
        .then((result) => responseHandler(req, res, msg.record_deleted, true, result))
        .catch((error) => responseHandler(req, res, error));
}