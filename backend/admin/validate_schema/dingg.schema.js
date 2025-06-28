const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const { generateToken } = require("../services/auth.service");

/**
 * ---------------------------------------
 * Schema Functions for auth API
 * ---------------------------------------
 */

module.exports = {
    getSlots,
    createBooking,
    getUserBookings,
    cancelBooking
};

function getSlots(req, res, next) {
    const schema = Joi.object({
        startDate: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .label('Start Date')
            .messages({ 'string.pattern.base': '"startDate" must be in YYYY-MM-DD format' }),

        endDate: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .label('End Date')
            .messages({ 'string.pattern.base': '"endDate" must be in YYYY-MM-DD format' }),

        serviceIds: Joi.array()
            .items(Joi.number().integer())
            .optional()
            .label('Service IDs'),

        staffId: Joi.number()
            .integer()
            .optional()
            .label('Staff ID')
    });
    validateRequest(req, res, next, schema);
}

function createBooking(req, res, next) {
    const schema = Joi.object({
        vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
        booking_date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .label('Booking Date')
            .messages({
                'string.pattern.base': '"booking_date" must be in YYYY-MM-DD format'
            }),
        booking_comment: Joi.string().allow('').optional().label('Booking Comment'),
        booking_status: Joi.string()
            .required()
            .label('Booking Status'),
        merge_services_of_same_staff: Joi.boolean().required().label('Merge Services of Same Staff'),
        total: Joi.number().positive().required().label('Total'),
        services: Joi.array().items(
            Joi.object({
                service_id: Joi.number().integer().required().label('Service ID'),
                service_name: Joi.string().required().label('Service Name'),
                start_time: Joi.number().integer().required().label('Start Time'),
                end_time: Joi.number().integer().required().label('End Time')
            })
        ).min(1).required().label('Services')
    });

    validateRequest(req, res, next, schema);
}

function getUserBookings(req, res, next) {
    const schema = Joi.object({
        vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
        booking_type: Joi.number().valid(1, 2, 3).required().label('Booking Type').messages({
            'any.only': '"booking_type" must be 1 (UPCOMING), 2 (CANCELLED), or 3 (PREVIOUS)'
        }),
        page: Joi.number().integer().min(1).default(1).label('Page'),
        limit: Joi.number().integer().min(1).default(10).label('Limit')
    });

    validateRequest(req, res, next, schema);
}

function cancelBooking(req, res, next) {
    const schema = Joi.object({
        vendor_location_uuid: Joi.string().required().label('Vendor Location UUID'),
        id: Joi.string().required().label('Id')
    });

    validateRequest(req, res, next, schema);
}