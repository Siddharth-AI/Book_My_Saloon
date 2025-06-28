const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");

/**
 * ---------------------------------------
 * Schema Functions for auth API
 * ---------------------------------------
 */

module.exports = {
    sendOtp,
    verifyOtp,
    profileSetup,
    forgotPassword,
    resetPassword,
    login,
    updateProfile,
    changePassword
};

function sendOtp(req, res, next) {
    const schema = Joi.alternatives().try(
        // Mobile OTP Schema
        Joi.object({
            dial_code: Joi.number().required(),
            mobile: Joi.string().required(),
            country_id: Joi.string().required(),
            vendor_location_uuid: Joi.string().required(),
            email: Joi.forbidden()
        }),
        // Email OTP Schema
        Joi.object({
            email: Joi.string().email().required(),
            vendor_location_uuid: Joi.string().required(),
            dial_code: Joi.forbidden(),
            mobile: Joi.forbidden(),
            country_id: Joi.forbidden()
        })
    );

    validateRequest(req, res, next, schema);
}

function verifyOtp(req, res, next) {
    const schema = Joi.alternatives().try(
        // Mobile OTP Verification Schema
        Joi.object({
            vendor_location_uuid: Joi.string().required(),
            dial_code: Joi.number().required(),
            mobile: Joi.string().required(),
            country_id: Joi.string().required(),
            otp: Joi.string().required(),
            email: Joi.forbidden()
        }),
        // Email OTP Verification Schema
        Joi.object({
            vendor_location_uuid: Joi.string().required(),
            email: Joi.string().email().required(),
            otp: Joi.string().required(),
            dial_code: Joi.forbidden(),
            mobile: Joi.forbidden(),
            country_id: Joi.forbidden()
        })
    );

    validateRequest(req, res, next, schema);
}

function profileSetup(req, res, next) {
    const schema = Joi.object({
        password: Joi.string().required(),
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        vendor_location_uuid: Joi.string().required(),
        verified_by: Joi.string().valid('email', 'mobile').required(),
        gender: Joi.string().allow('', null),
        email: Joi.string().email().required(),
        dial_code: Joi.string().required(),
        country_id: Joi.string().required()
    });

    validateRequest(req, res, next, schema);
}

function forgotPassword(req, res, next) {
    const schema = Joi.alternatives().try(
        // Mobile-based schema
        Joi.object({
            dial_code: Joi.number().required(),
            mobile: Joi.string().required(),
            country_id: Joi.string().required(),
            vendor_location_uuid: Joi.string().required(),
            email: Joi.forbidden()
        }),
        // Email-based schema
        Joi.object({
            email: Joi.string().email().required(),
            vendor_location_uuid: Joi.string().required(),
            dial_code: Joi.forbidden(),
            mobile: Joi.forbidden(),
            country_id: Joi.forbidden()
        })
    );

    validateRequest(req, res, next, schema);
}

function resetPassword(req, res, next) {
    const schema = Joi.alternatives().try(
        // Mobile-based reset
        Joi.object({
            dial_code: Joi.number().required(),
            mobile: Joi.string().required(),
            country_id: Joi.string().required(),
            vendor_location_uuid: Joi.string().required(),
            password: Joi.string().required(),
            verification_code: Joi.string().required(),
            email: Joi.forbidden()
        }),
        // Email-based reset
        Joi.object({
            email: Joi.string().email().required(),
            vendor_location_uuid: Joi.string().required(),
            password: Joi.string().required(),
            verification_code: Joi.string().required(),
            dial_code: Joi.forbidden(),
            mobile: Joi.forbidden(),
            country_id: Joi.forbidden()
        })
    );

    validateRequest(req, res, next, schema);
}

function login(req, res, next) {
    const schema = Joi.alternatives().try(
        // Mobile-based login
        Joi.object({
            dial_code: Joi.number().required(),
            mobile: Joi.string().required(),
            country_id: Joi.string().required(),
            vendor_location_uuid: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.forbidden()
        }),
        // Email-based login
        Joi.object({
            email: Joi.string().email().required(),
            vendor_location_uuid: Joi.string().required(),
            password: Joi.string().required(),
            dial_code: Joi.forbidden(),
            mobile: Joi.forbidden(),
            country_id: Joi.forbidden()
        })
    );

    validateRequest(req, res, next, schema);
}

function updateProfile(req, res, next) {
    const schema = Joi.alternatives().try(
        
    );

    validateRequest(req, res, next, schema);
}

function changePassword(req, res, next) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    const schema = Joi.object({
        new_password: Joi.string()
            .pattern(passwordRegex)
            .required()
            .label('New Password')
            .messages({
                'string.pattern.base': '"New Password" must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long.'
            }),
        old_password: Joi.string().required().label('Old Password'),
        vendor_location_uuid: Joi.string().uuid().required().label('Vendor Location UUID')
    });

    validateRequest(req, res, next, schema);
}