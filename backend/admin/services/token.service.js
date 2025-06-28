const axios = require('axios');

let tokenData = {
    token: null,
    expiry: null,
};

async function generateToken() {
    console.log("#########Generating new token...");
    try {
        const response = await axios.post(
            `${process.env.DINGG_API_URL}/tech-partner/generate-token`,
            {},
            {
                headers: {
                    'access_code': process.env.DINGG_ACCESS_CODE,
                    'api_key': process.env.DINGG_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { token, expires_in } = response.data;

        const bufferSeconds = 60;
        tokenData.token = token;
        tokenData.expiry = Date.now() + (expires_in - bufferSeconds) * 1000;

        console.log("Token generated and stored:", tokenData);
        return token;
    } catch (err) {
        console.error("Error in generateToken:", err.response?.data || err.message);
        throw err;
    }
}

async function getValidToken() {
    console.log("Checking token:", tokenData);
    if (!tokenData.token || Date.now() >= tokenData.expiry) {
        await generateToken();
    }
    return tokenData.token;
}

module.exports = {
    generateToken,
    getValidToken,
    tokenData
}; 