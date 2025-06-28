/**
 * This helper function is used to convert hashing passwords and storing into the database
 */
const bcrypt = require('bcryptjs');

// encode password
const securePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

// compare password
const comparePassword = async (password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}

module.exports = {
    securePassword,
    comparePassword,
};