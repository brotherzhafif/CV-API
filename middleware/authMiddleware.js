const admin = require('firebase-admin');

// // Inisialisasi Firebase Admin SDK
// const serviceAccount = require('../config/key.json'); // Path ke key.json Anda
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// Middleware untuk memverifikasi token
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header Authorization

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan. Anda harus login terlebih dahulu.',
        });
    }

    try {
        // Verifikasi token menggunakan Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Simpan data pengguna ke req.user
        next(); // Lanjutkan ke handler berikutnya
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid.',
            error: error.message,
        });
    }
};

module.exports = verifyToken;