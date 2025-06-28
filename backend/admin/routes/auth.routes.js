/**
 * Define Users routes
 */
const express = require("express");
const router = express.Router();
const ROLES_LIST = require('_config/roles_list');
const ipHandler = require("_middleware/ipHandler");
const verifyToken = require("_middleware/verify-token");
const getToken = require("_middleware/get-token");
const controllers = require("../controllers/auth.controller");
const schema = require("../validate_schema/auth.schema");
const uploadImageSingle = require("../../_middleware/upload-image");

const multer = require('multer');
// You can customize the storage if needed
const storage = multer.memoryStorage(); // or diskStorage for saving to disk
const upload = multer({ storage: storage });


// API routes
router.post("/create-customer", controllers.createCustomer);

router.post("/send-otp", schema.sendOtp, controllers.sendOtp);
router.post("/verify-otp", schema.verifyOtp, controllers.verifyOtp);
router.post("/profile-setup", schema.profileSetup, controllers.profileSetup);
router.get("/get-profile", controllers.getProfile);
router.get("/user-logout", controllers.user_logout);
router.post("/forgot-password", schema.forgotPassword, controllers.forgotPassword);
router.post("/reset-password", schema.resetPassword, controllers.resetPassword);
router.post("/login", schema.login, controllers.login);
router.post("/update-profile", upload.single('profile_pic'), controllers.updateProfile);
router.post("/change-password", schema.changePassword, controllers.changePassword);

module.exports = router;
