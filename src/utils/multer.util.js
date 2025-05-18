const multer = require('multer');
const path = require('path');
const fs = require('fs');

// MIME: Multipurpose Internet Mail Extensions
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const createUploader = (subfolder = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(process.cwd(), 'src/public/images', subfolder);

      if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });  
      }

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG o WEBP.'));
        }
    };

  return multer({ 
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, //2 MB
    }
  });
};

module.exports = createUploader;
