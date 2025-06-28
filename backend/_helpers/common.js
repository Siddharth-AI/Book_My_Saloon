/**
 * Common helper functions
 */
"use strict";
const moment = require("moment");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const config = require("_config/config.json");
const logger = require("_helpers/logger");
const handlebars = require('handlebars');

module.exports = {
    // Generate new unique id
    generateUniqueID: function () {
        const miliSeconds = Date.now();
        const secondStr = String(miliSeconds).slice(-10);
        return Number(secondStr);
    },
    // log to console
    log: function (str) {
        if (process.env.NODE_ENV === "development") {
            console.log(str);
        }
    },
    // Check Empty or Null string
    checkEmptyString: function (myString) {
        let result = false;
        if (typeof myString === "string" && myString.trim().length === 0) {
            result = true;
        }
        return result;
    },
    // Capitalize All
    capitalizeAll: function (input) {
        let words = input.split(" ");
        let cpWords = words.map((word) => {
            let lcWord = word.toLowerCase();
            return lcWord.charAt(0).toUpperCase() + lcWord.slice(1);
        });
        return cpWords.join(" ");
    },
    // Get current data & time
    curDateTime: function (isTime = true) {
        let strFormat = isTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
        let today = moment().tz(process.env.TZ).format(strFormat);
        return today;
    },
    // Change date format
    dateFormat: function (strDate = "", strFormat = "YYYY-MM-DD") {
        if (strDate !== "") {
            strDate = moment(strDate).tz(process.env.TZ).format(strFormat);
        }
        return strDate;
    },
    dateFormatSQL: function (strDate = "", passFormat = "DD-MM-YYYY", strFormat = "YYYY-MM-DD") {
        if (strDate !== "") {
            strDate = moment(strDate, passFormat).format(strFormat);
        }
        return strDate;
    },
    addDay: function (strDate = "", days=0, strFormat = "YYYY-MM-DD HH:mm:ss") {
        if (strDate !== "") {
            strDate = moment(strDate).add(days, 'd').tz(process.env.TZ).format(strFormat);
        }
        return strDate;
    },
    // Returns the given `obj` without the `property`
    withoutProperty: function (obj, property) {
        const { [property]: unused, ...rest } = obj;
        return rest;
    },
    // to check numeric value
    isNumeric: function (n) {
        return typeof n == "number" && !isNaN(n);
    },
    // to check numeric value
    genRandom: function (n) {
        const min = Math.pow(10, n - 1);
        const max = Math.pow(10, n) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // calculate VAT amount
    getVatAmount: function (amount = 0) {
        return amount > 0 ? amount - (amount * (100 / (100 + config.app.vat))) : 0;
    },
    // calculate price excluding VAT amount
    getExVatAmount: function (amount = 0) {
        return amount > 0 ? amount - this.getVatAmount(amount) : 0;
    },
    // calculate product discount amount
    getDiscountAmount: function (price = 0, discount = 0) {
        return discount && discount > 0 ? this.getExVatAmount(price) * (discount / 100) : 0;
    },
    // Calculate discount without VAT amount
    calculateDiscount: function (amount = 0, discount = 0) {
        return discount && discount > 0 ? amount * (discount / 100) : 0;
    },
    // Calculate VAT without VAT price
    calculateVat: function (amount = 0, percentage = 0) {
        return percentage > 0 ? amount * (percentage / 100) : 0;
    },
    // Calculate Percentage (%)
    calculatePercentage: function (amount = 0, percentage = 0) {
        return percentage > 0 ? amount * (percentage / 100) : 0;
    },
    pagination: async function (page_no, limit) {
        let result = { page_no: 0, limit: 10, offset: 0 };
        page_no = parseInt(page_no) ? parseInt(page_no) - 1 : 0;
        page_no = page_no < 0 ? 0 : page_no;
        limit = parseInt(limit || 10);
        limit = limit <= 0 ? 10 : limit;
        result.offset = page_no * limit;
        return Object.assign(result, { page_no, limit });
    },
    // Create a random string
    generateRandomString: function (length) {
        let result = "";
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()";
        const allCharacters = alphabet + numbers + symbols;
        let hasAlphabet = false;
        let hasNumber = false;
        let hasSymbol = false;

        while (result.length < length || !(hasAlphabet && hasNumber && hasSymbol)) {
            const character = allCharacters.charAt(
                Math.floor(Math.random() * allCharacters.length)
            );
            if (alphabet.includes(character)) {
                hasAlphabet = true;
            } else if (numbers.includes(character)) {
                hasNumber = true;
            } else if (symbols.includes(character)) {
                hasSymbol = true;
            }
            result += character;
        }
        return result;
    },
    // Create a random string (Alphabet & Numbers)
    randAlphaNumeric: function (length) {
        let result = "";
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const allCharacters = alphabet + numbers;
        let hasAlphabet = false;
        let hasNumber = false;

        while (result.length < length || !(hasAlphabet && hasNumber)) {
            const character = allCharacters.charAt(
                Math.floor(Math.random() * allCharacters.length)
            );
            if (alphabet.includes(character)) {
                hasAlphabet = true;
            } else if (numbers.includes(character)) {
                hasNumber = true;
            }
            result += character;
        }
        return result;
    },
    toUpperCaseWord: function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return word.toUpperCase();
        }).replace(/\s+/g, ' ');
    },
    // Send mail
    sendMail: async function (
        header = "", // Add header
        emails = [], // To send emails
        subject = "", // Subject of the email
        template = "", // Email template name
        context = {}, // Email template body key => values
        ccEmail = [], // CC mail address
        bccEmail = [], // BCC mail address
        attachments = [] // Mail Attachment
    ) {
        const { host, port, username, password } = config.mailer;
        const templatePath = path.resolve(__dirname, "..", "email_template/");
        const includePath = path.resolve(
            __dirname,
            "..",
            "email_template/"
        );
        // create reusable transporter object using the default SMTP transport
        let createTransport = {};
        if (process.env.NODE_ENV === "production") {
            createTransport = {
                host: host,
                port: port,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: username,
                    pass: password,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            };
        } else {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();
            createTransport = {
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            };
        }
        let transport = nodemailer.createTransport(createTransport);

        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                extName: ".handlebars", // extension name
                layoutsDir: templatePath, // layout path declare
                partialsDir: includePath, // partials directory path
                defaultLayout: false,
            },
            viewPath: templatePath,
            extName: ".handlebars",
        };

        // Use a template file with the nodemailer
        transport.use("compile", hbs(handlebarOptions));

        // Append admin email address to mail body
        Object.assign(context, {
            domain: config.app.domain,
            title: config.app.title,
            admin_email: config.app.admin_email,
            base_url: process.env.BASE_URL,
            copyright_year: moment().tz(process.env.TZ).format("YYYY"),
        });

        // mail options
        let mailOptions = {
            from: {
                name: config.app.short_name + " " + header,
                address: config.app.email,
            },
            to: emails,
            subject: config.app.short_name + " - " + subject,
            template,
            context,
        };

        // Add CC
        if (ccEmail.length > 0) {
            mailOptions["cc"] = ccEmail;
        }

        // Add BCC
        bccEmail.push(config.app.developer_email);
        if (bccEmail.length > 0) {
            mailOptions["bcc"] = bccEmail;
        }
        // Add Attachments
        if (attachments.length > 0) {
            mailOptions["attachments"] = attachments;
        }
        // send mail with defined transport object
        return new Promise(function (resolve, reject) {
            transport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    logger.error(`Email ${error}`);
                    reject(error);
                } else {
                    if (process.env.NODE_ENV === "development") {
                        // Preview only available when sending through an Ethereal account
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        if (mailOptions.attachments && mailOptions.attachments.length > 0) {
                            console.log('Attachments are present in the email.');
                        } else {
                            console.log('No attachments found in the email.');
                        }
                    }
                    resolve(info);
                }
            });
        });
    },
    ifEquals: function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
};
// Define the "ifEquals" helper
handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
// Define the "add" helper
handlebars.registerHelper('add', function (value1, value2) {
    return value1 + value2;
});
// Define the "multiply" helper
handlebars.registerHelper('multiply', function (value1, value2) {
    return value1 * value2;
});