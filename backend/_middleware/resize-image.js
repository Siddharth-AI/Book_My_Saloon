/**
 * Our own image-resizing using Express & Sharp
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function resizeImage(path, format, width, height) {
    const readStream = fs.createReadStream(path);
    let transform = sharp();

    if (format) {
        transform = transform.toFormat(format);
    }

    if (width || height) {
        transform = transform.resize(width, height);
    }

    return readStream.pipe(transform);
}

async function thumbImage(req, res, next, options) {
    try {
        if (req.file) {
            const { filename } = req.file;
            const name = path.parse(filename).name + '.webp';
            await sharp(req.file.path, { failOnError: false })
                .withMetadata()
                .resize(options.width, options.height)
                .toFile(path.resolve(req.file.destination, 'thumbs', name));
        }
        if (req.files) {
            req.files.map(async (x) => {
                const { filename } = x;
                const name = path.parse(filename).name + '.webp';
                return await sharp(x.path, { failOnError: false })
                    .withMetadata()
                    .resize(options.width, options.height)
                    .toFile(path.resolve(x.destination, 'thumbs', name));
            });
        }
    } catch (err) {
        console.log(`Thumbnail Error: ${err.message}`);
    }
}

module.exports = {
    resizeImage,
    thumbImage,
};
