const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan sementara
const storage = multer.memoryStorage(); // Simpan file di memori sementara
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimal ukuran file 5MB
});

module.exports = upload;