/**
 * The auth service is responsible for all database interaction and core business logic
 * related to auth CRUD operations, it encapsulates all interaction with the Sequelize
 * auth model and exposes a simple set of methods which are used by the countries controller.
 */
const db = require("_helpers/db");
const common = require("_helpers/common");
const axios = require('axios');
const tokenService = require('./token.service');
const FormData = require('form-data');

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

// Create a new customer in Dingg
async function createCustomer(customerData, vendor_location_uuid) {
    try {
        const token = await tokenService.getValidToken();
        const url = `${process.env.DINGG_API_URL}/vendor/customer_create`;
        // Ensure all required fields are present with default values if not provided
        const payload = {
            fname: customerData.fname,
            lname: customerData.lname,
            mobile: customerData.mobile,
            sms_trans: customerData.sms_trans ?? true,
            sms_promo: customerData.sms_promo ?? true,
            email_trans: customerData.email_trans ?? false,
            email_promo: customerData.email_promo ?? false
        };
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'vendor_location_uuid': vendor_location_uuid
            }
        });
        if (response.status == 200 || response.status == 201) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        if (error.response?.status === 401) {
            // Token might be expired or invalid — regenerate and retry once
            const newToken = await tokenService.generateToken();

            const retryResponse = await axios.post(
                `${process.env.DINGG_API_URL}/vendor/customer_create`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': newToken,
                        'vendor_location_uuid': vendor_location_uuid
                    }
                }
            );
            return retryResponse.data;
        }
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}

async function sendOtp(data) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/send-otp`;

        let payload;

        // Check which type of OTP needs to be sent
        if (data.mobile) {
            // Case 1: Mobile OTP
            payload = {
                dial_code: data.dial_code,
                mobile: data.mobile,
                country_id: data.country_id,
                vendor_location_uuid: data.vendor_location_uuid
            };
        } else if (data.email) {
            // Case 2: Email OTP
            payload = {
                email: data.email,
                vendor_location_uuid: data.vendor_location_uuid
            };
        } else {
            throw new Error('Either mobile number with dial_code and country_id OR email is required');
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Send OTP Error:', error.response?.data || error.message);
        throw error;
    }
}

async function verifyOtp(data) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/verify-otp`;

        let payload;

        // Check which type of OTP verification needs to be done
        if (data.mobile) {
            // Case 1: Mobile OTP verification
            payload = {
                vendor_location_uuid: data.vendor_location_uuid,
                dial_code: data.dial_code,
                mobile: data.mobile,
                country_id: data.country_id,
                otp: data.otp
            };
        } else if (data.email) {
            // Case 2: Email OTP verification
            payload = {
                vendor_location_uuid: data.vendor_location_uuid,
                email: data.email,
                otp: data.otp
            };
        } else {
            throw new Error('Either mobile number with dial_code and country_id OR email is required');
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Verify OTP Error:', error.response?.data || error.message);
        throw error;
    }
}

async function profileSetup(data, token) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/profile/setup`;
        const payload = {
            password: data.password,
            name: data.name,
            mobile: data.mobile,
            vendor_location_uuid: data.vendor_location_uuid,
            verified_by: data.verified_by,
            gender: data.gender,
            email: data.email,
            dial_code: data.dial_code,
            country_id: data.country_id
        };
        const cleanToken = token.replace('Bearer ', '');
        const response = await axios.put(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            }
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Profile Setup Error:', error.response?.data || error.message);
        throw error;
    }
}

async function getProfile(token) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/profile`;

        // Remove 'Bearer' prefix if it exists in the token
        const cleanToken = token.replace('Bearer ', '');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Get Profile Error:', error.response?.data || error.message);
        throw error;
    }
}

async function user_logout(token) {
    const url = `${process.env.DINGG_API_URL}/client/auth/logout`;
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
        // no body ⇒ use null (or {}) as the second arg,
        // pass headers in the third arg
        const response = await axios.put(
            url,
            null,                               // <-- body
            { headers: { Authorization: authHeader } } // <-- config
        );
        console.log("Logout response:", response.data);
        if (response.status === 200 || response.status === 204) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (err) {
        console.log("Logout error:", err);
        throw err;
    }
}

async function forgotPassword(data) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/forgot-password`;

        let payload = {
            vendor_location_uuid: data.vendor_location_uuid
        };

        if (data.email) {
            payload.email = data.email;
        } else if (data.mobile && data.dial_code && data.country_id) {
            payload.mobile = data.mobile;
            payload.dial_code = data.dial_code;
            payload.country_id = data.country_id;
        } else {
            throw new Error('Invalid input: Provide either email or mobile, dial_code, country_id');
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Forgot Password Error:', error.response?.data || error.message);
        throw error;
    }
}

async function resetPassword(data) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/reset-password`;

        // Base payload: always required fields
        let payload = {
            vendor_location_uuid: data.vendor_location_uuid,
            password: data.password,
            verification_code: data.verification_code
        };

        // Decide which identity fields to include
        if (data.email) {
            payload.email = data.email;
        } else if (data.mobile && data.dial_code && data.country_id) {
            payload.mobile = data.mobile;
            payload.dial_code = data.dial_code;
            payload.country_id = data.country_id;
        } else {
            throw new Error(
                'Invalid input: Provide either email OR mobile, dial_code, country_id'
            );
        }

        const response = await axios.patch(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(
            'Reset Password Error:',
            error.response?.data || error.message
        );
        throw error;
    }
}

async function login(data) {
    try {
        const url = `${process.env.DINGG_API_URL}/client/auth/login`;

        // Base payload always required
        let payload = {
            vendor_location_uuid: data.vendor_location_uuid,
            password: data.password
        };

        // Choose identity path
        if (data.email) {
            payload.email = data.email;
        } else if (data.mobile && data.dial_code && data.country_id) {
            payload.mobile = data.mobile;
            payload.dial_code = data.dial_code;
            payload.country_id = data.country_id;
        } else {
            throw new Error(
                'Invalid input: provide either email OR mobile with dial_code & country_id'
            );
        }

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;                  // e.g. { token, user, ... }
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw error;
    }
}

async function updateProfile(body, file, token) {
    try {
        const form = new FormData();

        // Append file
        if (file) {
            form.append('profile_pic', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
        }

        // Append all fields from body
        form.append('vendor_location_uuid', body.vendor_location_uuid);
        form.append('email', body.email);
        form.append('name', body.name);
        if (body.dob !== undefined && body.dob !== '') {
            form.append('dob', body.dob);
        }
        form.append('gender', body.gender);
        form.append('mobile', body.mobile);
        form.append('dial_code', body.dial_code);
        form.append('country_id', body.country_id);
        if (body.address !== undefined && body.address !== null && body.address !== '') {
            form.append('address', body.address);
        }

        // Send API request
        const response = await axios.patch(
            `${process.env.DINGG_API_URL}/client/auth/profile`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: token,
                },
            }
        );

        return response.data;
    } catch (err) {
        console.error("Error in updateProfileService:", err.response?.data || err.message);
        throw err;
    }
}

async function changePassword(params, token) {
    const url = `${process.env.DINGG_API_URL}/client/auth/change-password`;

    // Base payload always required
    let payload = {
        vendor_location_uuid: params.vendor_location_uuid,
        old_password: params.old_password,
        new_password: params.new_password
    };

    const headers = {
        Authorization: token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.patch(url, payload, { headers });
        return response.data;
    } catch (error) {
        console.error("Change Password Error:", error?.response?.data || error.message);
        throw error;
    }
}