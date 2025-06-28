/**
 * The auth service is responsible for all database interaction and core business logic
 * related to auth CRUD operations, it encapsulates all interaction with the Sequelize
 * auth model and exposes a simple set of methods which are used by the countries controller.
 */
const db = require("_helpers/db");
const common = require("_helpers/common");
const axios = require('axios');
const tokenService = require('./token.service');
const auth = require('./auth.service');

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

async function getLocations() {
    const url = `${process.env.DINGG_API_URL}/tech-partner/locations`;

    const getHeaders = (token) => ({
        'access_code': process.env.DINGG_ACCESS_CODE,
        'api_key': process.env.DINGG_API_KEY,
        'Content-Type': 'application/json',
        'Authorization': token
    });

    const token = await tokenService.getValidToken();

    try {
        const response = await axios.get(url, {
            headers: getHeaders(token),
        });

        return response.data;
    } catch (error) {
        // If token is expired or unauthorized
        if (error.response?.status === 401) {
            console.warn("Token expired or unauthorized. Regenerating...");

            const newToken = await tokenService.generateToken();

            const retryResponse = await axios.get(url, {
                headers: getHeaders(newToken),
            });

            return retryResponse.data;
        }

        console.error("Error in getLocations:", error.response?.data || error.message);
        throw error;
    }
}

// /tech-partner/services/:businessId
async function getServices(businessId) {
    const token = await tokenService.getValidToken();

    const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/services`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    try {
        const response = await axios.get(url, { headers });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Token might be expired or invalid — regenerate and retry once
            const newToken = await tokenService.generateToken();

            const retryResponse = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': newToken,
                }
            });

            return retryResponse.data;
        } else {
            console.error("getServices error:", error.response?.data || error.message);
            throw error;
        }
    }
}

async function getOperators(businessId) {
    // 1) Get a cached / still-valid token (your existing helper)
    const token = await tokenService.getValidToken();

    const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/operators`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    try {
        // 2) First attempt
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        // 3) If token was invalid/expired, regenerate once and retry
        if (error.response?.status === 401) {
            const newToken = await tokenService.generateToken();

            const retryResponse = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': newToken
                }
            });

            return retryResponse.data;
        }

        // 4) Any other error → bubble up
        console.error('getOperators error:', error.response?.data || error.message);
        throw error;
    }
}

async function getBusinessHours(businessId) {
    const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/hours`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('getBusinessHours error:', error.response?.data || error.message);
        throw error;
    }
}

async function getSlots(businessId, params) {
    const { startDate, endDate, serviceIds = [], staffId } = params;
    // Build query string if service IDs are provided
    // const serviceQuery = serviceIds.length > 0 ? `?service_ids=${serviceIds.join(',')}` : '';
    let url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/slots/${startDate}/${endDate}`;

    const queryParams = [];

    if (serviceIds.length > 0) {
        queryParams.push(`service_ids=${serviceIds.join(',')}`);
    }

    if (staffId) {
        queryParams.push(`staff_id=${staffId}`);
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }
    console.log('getSlots URL:', url);
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('getAvailableSlots error:', error.response?.data || error.message);
        throw error;
    }
}

async function createBooking(params, userToken) {
    const userData = await auth.getProfile(userToken);
    if (userData?.data?.user?.uuid) {
        const customerUuid = userData.data.user.uuid;
        const url = `${process.env.DINGG_API_URL}/user/booking`;
        let token = await tokenService.getValidToken();
        if (!token) {
            console.error("No valid token available for createBooking");
            throw new Error("Authentication required");
        }

        // 1. Build payload
        const payload = {
            vendor_location_uuid: params.vendor_location_uuid,
            booking_date: params.booking_date,
            booking_comment: params.booking_comment || '',
            booking_status: params.booking_status,
            merge_services_of_same_staff: params.merge_services_of_same_staff,
            total: params.total,
            services: params.services
        };
        // 2. Build headers with user UUID
        const headers = {
            customer_uuid: customerUuid,
            vendor_location_uuid: params.vendor_location_uuid,   // keep if docs say so
            Authorization: userToken,                            // <<< change here
            'Content-Type': 'application/json'
        };
        try {
            const res = await axios.post(url, payload, {
                headers: headers,
            });
            console.log("Booking created successfully:", res);
            return res.data;
        } catch (err) {
            if (err.response?.status === 401) {
                console.warn("Token expired. Regenerating...");
                const newToken = await tokenService.generateToken();
                const newHeaders = {
                    ...headers,
                    Authorization: newToken
                };
                const retryRes = await axios.post(url, payload, {
                    headers: newHeaders
                });
                return retryRes.data;
            }

            console.error("createBooking error:", err.response?.data || err.message);
            throw err;
        }
    }else {
        console.error("User UUID not found in createBooking");
        throw new Error("User authentication required");
    }
}

async function getUserBookings(params, userToken) {
    const userData = await auth.getProfile(userToken);
    const customerUuid = userData?.data?.user?.uuid;

    if (!customerUuid) {
        console.error("User UUID not found in getUserBookings");
        throw new Error("User authentication required");
    }

    const typeMap = {
        1: "UPCOMING",
        2: "CANCELLED",
        3: "PREVIOUS"
    };

    const bookingType = typeMap[params.booking_type];
    if (!bookingType) {
        throw new Error("Invalid booking_type.");
    }

    const businessUuid = params.vendor_location_uuid;
    const url = `${process.env.DINGG_API_URL}/user/bookings/${businessUuid}/${bookingType}?page=${params.page || 1}&limit=${params.limit || 10}`;

    const headers = {
        customer_uuid: customerUuid,
        vendor_location_uuid: businessUuid,
        Authorization: userToken,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (err) {
        console.error("getUserBookings error:", err.response?.data || err.message);
        throw err;
    }
}

async function cancelBooking(params, userToken) {
    const userData = await auth.getProfile(userToken);
    const customerUuid = userData?.data?.user?.uuid;

    if (!customerUuid) {
        console.error("User UUID not found in getUserBookings");
        throw new Error("User authentication required");
    }
    const url = `${process.env.DINGG_API_URL}/user/bookings/${params.id}`;
    const config = {
        headers: {
            Authorization: userToken,
            vendor_location_uuid: params.vendor_location_uuid,
            customer_uuid: customerUuid,
        }
    };

    try {
        const response = await axios.delete(url, config);
        return response.data;
    } catch (error) {
        console.error("Cancel Booking Error:", error?.response?.data || error.message);
        throw error;
    }
}