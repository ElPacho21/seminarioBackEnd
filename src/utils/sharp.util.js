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

async function cropToSquare(buffer) {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const size = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - size) / 2);
    const top = Math.floor((metadata.height - size) / 2);

    return await image.extract({
        width: size,
        height: size,
        left,
        top
    }).toBuffer();
}

async function optimizeImages(files, options = {}) {
    if (!Array.isArray(files)) files = [files];

    const {
        quality = 80,
        keepOriginal = false,
        outputFolder = null,
        forceSquare = true
    } = options;

    const optimizedFilenames = [];

    for (const file of files) {
        const inputPath = file.path;
        const baseName = path.parse(file.filename).name;
        const outputFilename = baseName + '.webp';
        const finalOutputFolder = outputFolder || path.dirname(inputPath);
        const outputPath = path.join(finalOutputFolder, outputFilename);

        try {
            const inputBuffer = await fsPromises.readFile(inputPath);

            const bufferToOptimize = forceSquare? await cropToSquare(inputBuffer): inputBuffer;

            await sharp(bufferToOptimize).webp({ quality }).toFile(outputPath);

            if (!keepOriginal) {
                await deleteFileWithRetries(inputPath);
            }

            optimizedFilenames.push(outputFilename);
        } catch (err) {
            console.error(`Error procesando ${inputPath}:`, err.message);
        }
    }

    return optimizedFilenames.length === 1 ? optimizedFilenames[0] : optimizedFilenames;
}

module.exports = optimizeImages;
