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

        // Buat signed URL untuk file
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 24 * 60 * 60 * 1000 // URL berlaku selama 1 jam
        });

        // Lakukan scoring CV
        const scoringResult = await scoreCV(req.file.buffer);

        // Buat ID unik untuk CV
        const cvId = db.collection('cvs').doc().id;

        // Simpan data ke Firestore
        const newCV = {
            userId,
            cvId,
            pdfUrl: signedUrl, // Gunakan signed URL
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

const getCVs = async (req, res) => {
    try {
        const userId = req.user.uid; // Ambil userId dari token Firebase

        // Ambil semua CV dari Firestore berdasarkan userId
        const snapshot = await db.collection('cvs').where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(200).json({ success: true, cvs: [] });
        }

        const cvs = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const cv = doc.data();

                // Buat signed URL baru untuk setiap CV
                const file = bucket.file(cv.fileName);

                return {
                    ...cv,
                };
            })
        );

        res.status(200).json({ success: true, cvs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching CVs', error: error.message });
    }
};

module.exports = {
    submitCV,
    getCVs,
};