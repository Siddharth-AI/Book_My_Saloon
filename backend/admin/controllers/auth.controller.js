/**
 * The auth controller defines all routes for the Node.js + MySQL CRUD API
 */
const responseHandler = require("_middleware/response-handler");
const service = require("../services/auth.service");
const msg = require("_config/message.json");
const s3Upload = require("_middleware/s3Upload");

module.exports = {
    createCustomer,
    sendOtp,
    verifyOtp,
    profileSetup,
    getProfile,
    user_logout,
    forgotPassword,
    resetPassword,
    login,
    updateProfile,
    changePassword
};

//Create Customer
async function createCustomer(req, res, next) {
    const vendor_location_uuid = req.headers['vendor_location_uuid'];
    if (!vendor_location_uuid) {
        responseHandler(req, res, msg.vendor_location_uuid_required, false);
    }else{
        service
            .createCustomer(req.body, vendor_location_uuid)
            .then((result) => responseHandler(req, res, msg.user.add, true, result))
            .catch((error) => responseHandler(req, res, error));
    }
}

async function sendOtp(req, res, next) {
    service
        .sendOtp(req.body)
        .then((result) => responseHandler(req, res, msg.user.otp_sent, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function verifyOtp(req, res, next) {
    service
        .verifyOtp(req.body)
        .then((result) => responseHandler(req, res, msg.user.otp_verified, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function profileSetup(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .profileSetup(req.body, token)
        .then((result) => responseHandler(req, res, msg.user.profile_setup, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function getProfile(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }

    try {
        const result = await service.getProfile(token);
        responseHandler(req, res, msg.user.found, true, result);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || msg.something_wrong;
        responseHandler(req, res, errorMessage, false);
    }
}

async function user_logout(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .user_logout(token)
        .then((result) => responseHandler(req, res, msg.user.logout, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function forgotPassword(req, res, next) {
    service
        .forgotPassword(req.body)
        .then((result) => responseHandler(req, res, msg.user.forgot_password, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function resetPassword(req, res, next) {
    service
        .resetPassword(req.body)
        .then((result) => responseHandler(req, res, msg.user.password_reset, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function login(req, res, next) {
    service
        .login(req.body)
        .then((result) => responseHandler(req, res, msg.user.login_success, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function updateProfile(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    // Handle profile image upload if present
    // if (req.file) {
    //     try {
    //         const uploadResult = await s3Upload.uploadImageSingle(req.file);
    //         req.body.profile_image = uploadResult.Location; // Assuming the upload returns the image URL
    //     } catch (error) {
    //         return responseHandler(req, res, 'Image upload failed', false);
    //     }
    // }
    service
        .updateProfile(req.body, req.file, token)
        .then((result) => responseHandler(req, res, msg.user.profile_updated, true, result))
        .catch((error) => responseHandler(req, res, error));
}

async function changePassword(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler(req, res, 'Authorization token is required', false);
    }
    service
        .changePassword(req.body, token)
        .then((result) => responseHandler(req, res, msg.user.password_changed, true, result))
        .catch((error) => responseHandler(req, res, error));
}