const { db, bucket } = require('../config/firebase'); // Impor Firestore dan Storage instance
const { scoreCV } = require('../utils/cvScoring');

const submitCV = async (req, res) => {
    try {
        const userId = req.user.uid;

        // Periksa apakah file PDF diupload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File PDF CV diperlukan'
            });
        }

        // Upload PDF ke Firebase Storage
        const fileName = `cvs/${userId}/${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
            metadata: {
                contentType: 'application/pdf'
            }
        });

        // Dapatkan URL publik untuk file
        const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Lakukan scoring CV
        const scoringResult = await scoreCV(req.file.buffer);

        // Buat ID unik untuk CV
        const cvId = db.collection('cvs').doc().id;

        // Simpan data ke Firestore
        const newCV = {
            userId,
            cvId,
            pdfUrl,
            fileName: req.file.originalname,
            scoring: scoringResult,
            createdAt: new Date().toISOString()
        };

        await db.collection('cvs').doc(cvId).set(newCV);

        res.status(201).json({
            success: true,
            message: 'CV berhasil diupload dan dinilai',
            cv: newCV
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error dalam memproses CV',
            error: error.message
        });
    }
};

// Fungsi untuk mendapatkan semua CV milik pengguna
const getCVs = async (req, res) => {
    try {
        const userId = req.user.uid; // Ambil userId dari token Firebase

        // Ambil semua CV dari Firestore berdasarkan userId
        const snapshot = await db.collection('cvs').where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(200).json({ success: true, cvs: [] });
        }

        const cvs = snapshot.docs.map(doc => doc.data());

        res.status(200).json({ success: true, cvs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching CVs', error: error.message });
    }
};

// Ekspor fungsi
module.exports = {
    submitCV,
    getCVs,
};