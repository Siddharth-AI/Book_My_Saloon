/**
 * Upload image handler
 */
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// To check if the given directory already exists or not
// If it is not to create a new directory
const checkDirectory = async (filesDir) => {
    fs.access(filesDir, (error) => {
        if (error) {
            // If current directory does not exist then create it
            fs.mkdirSync(filesDir, { recursive: true }, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    fs.mkdirSync(path.join(filesDir, 'thumbs'));
                    console.log('New Directory created successfully !!');
                }
            });
        } else {
            console.log('Given Directory already exists !!');
        }
    });
    return await filesDir;
};
// Image to be stored in uploads
// const storage = multer.diskStorage({
//     destination: async function (req, file, callback) {
//         let filesDir = path.join(__dirname, '..', 'public', 'uploads');
//         let thumbPath = path.join(filesDir, 'thumbs');
//         file['uploaded_path'] = path.join('uploads'); // original image path
//         file['thumbnail'] = path.join('thumbs'); // thumbnail image path
//         await checkDirectory(filesDir);
//         await checkDirectory(thumbPath);
//         callback(null, filesDir);
//     },
//     filename: function (req, file, callback) {
//         callback(null, 'upload_' + Date.now() + path.extname(file.originalname))
//     }
// });
const storage = multer.memoryStorage();

// Controlling the uploaded file
const fileFilter = (req, file, callback) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp'
    ) {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error('Only .png, .webp, .jpg and .jpeg format allowed!'));
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = (name) => {
    return (req, res, next) => {
        const file = upload.single(name);
        file(req, res, (err) => {
            if (err) {
                res.json({
                    status: false,
                    message: `File / Image Upload ${err}`,
                });
            } else {
                next();
            }
        });
    };
};
