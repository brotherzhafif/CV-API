
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); // Impor middleware
const { submitCV } = require('../controllers/cvController'); // Impor controller

router.get('/', (res) => {
    res.send('CV API is working!');
});

// Endpoint untuk mengirim CV (hanya bisa diakses jika login)
router.post('/submit', verifyToken, submitCV);

module.exports = router;