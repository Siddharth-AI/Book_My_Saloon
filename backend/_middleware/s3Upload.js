/**
 * S3 Services
 */
const { S3 } = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;

// Upload a single file
exports.s3UploadSingle = async (file, folder) => {
    try {
        let result = { status: false, fileName: '', originalname :''};
        if (typeof file !== 'undefined') {
            const s3 = new S3({
                region: process.env.AWS_REGION_NAME,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            let name = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
            // let type = file.originalname.substring(file.originalname.lastIndexOf('.') + 1, file.originalname.length);
            let ext = 'webp';
            const timestampInSeconds = Math.floor(Date.now() / 1000);
            result.fileName = `${timestampInSeconds}-${uuid()}.${ext}`;
            result.originalname = file.originalname;
            const param = {
                // ACL: 'public-read',
                ContentType: 'image/jpeg',
                Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
                Key: `${folder}/${result.fileName}`,
                Body: file.buffer,
            };
            let awsRes = await s3.upload(param).promise();
            if (awsRes) {
                Object.assign(result, { status: true }, awsRes);
            }
        }
        return result;
    } catch (err) {
        throw err;
    }
};
// Upload multiple files V2
exports.s3Uploadv2 = async (files, folder) => {
    try {
        let result = { status: false, files: [] };
        if (typeof files !== 'undefined' && files.length > 0) {
            const s3 = new S3({
                region: process.env.AWS_REGION_NAME,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            const params = files.map((file) => {
                let name = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
                let type = file.originalname.substring(
                    file.originalname.lastIndexOf('.') + 1,
                    file.originalname.length
                );
                
                let timestampInSeconds = Math.floor(Date.now() / 1000);
                let fileName = `${timestampInSeconds}-${uuid()}.${type}`;
                return {
                    // ACL: 'public-read',
                    ContentType: file.mimetype, //'image/jpeg',
                    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
                    Key: `${folder}/${fileName}`,
                    Body: file.buffer,
                    originalname: file.originalname
                };
            });
            let awsRes = await Promise.all(params.map(async (param) => {
                let output = await s3.upload(param).promise();
                output.originalName = param.originalname;
                return output
            }));
            if (awsRes) {
                result.status = true;
                result.files = awsRes;
            }
        }
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
// Upload multiple files V3
exports.s3Uploadv3 = async (file, folder) => {
    try {
        let result = { status: false, fileName: '' };
        if (typeof file !== 'undefined') {
            const s3client = new S3Client({
                region: process.env.AWS_REGION_NAME,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            result.fileName = `${uuid()}-${file.originalname}`;
            const param = {
                // ACL: 'public-read',
                ContentType: 'image/jpeg',
                Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
                Key: `${folder}/${result.fileName}`,
                Body: file.buffer,
            };
            let awsRes = await s3client.send(new PutObjectCommand(param));
            if (awsRes) {
                Object.assign(result, { status: true });
            }
        }
        return result;
    } catch (err) {
        throw err;
    }
};
// Get images from AWS S3 Bucket
exports.s3ImgHandler = async (imgName, folder) => {
    try {
        let result = null;
        const s3 = new S3({ region: process.env.AWS_REGION_NAME });
        const param = {
            Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
            Key: `${folder}/${imgName}`,
            Expires: 60 * 5, // time in seconds: e.g. 60 * 5 = 5 mins
        };
        // await s3.getObject(param, function (err, data) {
        //     if (err) {
        //         throw err;
        //     } else {
        //         let image = Buffer.from(data.Body).toString('base64');
        //         result = "data:image/webp;base64," + image;
        //     }
        // }).promise();
        await s3
            .getSignedUrl('getObject', param, function (err, url) {
                if (err) {
                    throw err;
                } else {
                    console.log(url);
                }
            })
            .promise();
        return result;
    } catch (err) {
        throw err;
    }
};
