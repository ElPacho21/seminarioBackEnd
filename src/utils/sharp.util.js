const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function deleteFileWithRetries(filePath, retries = 5, delayMs = 200) {
    for (let i = 0; i < retries; i++) {
        try {
            await fsPromises.unlink(filePath);
            return;
        } catch (err) {
            if (err.code === 'EBUSY' || err.code === 'EPERM') {
                await new Promise(res => setTimeout(res, delayMs));
            } else {
                throw err;
            }
        }
    }
    throw new Error(`No se pudo borrar el archivo después de varios intentos: ${filePath}`);
}

async function optimizeImages(files, options = {}) {
    const {
        quality = 80,
        keepOriginal = false,
        outputFolder = null
    } = options;

    const optimizedFilenames = [];

    for (const file of files) {
        const inputPath = file.path;
        const baseName = path.parse(file.filename).name;
        const outputFilename = baseName + '.webp';
        const finalOutputFolder = outputFolder || path.dirname(inputPath);
        const outputPath = path.join(finalOutputFolder, outputFilename);

        // Usamos stream explícito para asegurarnos que todo se libere
        const readStream = fs.createReadStream(inputPath);
        const transform = sharp().webp({ quality });
        const writeStream = fs.createWriteStream(outputPath);

        await new Promise((resolve, reject) => {
            readStream
                .pipe(transform)
                .pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
        });

        if (!keepOriginal) {
            try {
                await deleteFileWithRetries(inputPath);
            } catch (err) {
                console.error(`Error al borrar el archivo original ${inputPath}:`, err.message);
            }
        }

        optimizedFilenames.push(outputFilename);
    }

    return optimizedFilenames;
}

module.exports = optimizeImages;
