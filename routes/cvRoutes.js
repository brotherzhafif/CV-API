const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Middleware upload
const verifyToken = require('../middleware/authMiddleware'); // Middleware untuk verifikasi token
const { submitCV, getCVs } = require('../controllers/cvController'); // Impor fungsi submitCV

router.get('/', (res) => {
    res.send('Test Api Endpoint');
});

// Endpoint untuk mengirim CV (hanya bisa diakses jika login)
router.post('/submit-cv', upload.single('photo'), verifyToken, submitCV);
router.get('/get-cvs', verifyToken, getCVs);

module.exports = router;

