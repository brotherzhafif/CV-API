const { db, bucket } = require('../config/firebase'); // Impor Firestore dan Storage instance

const submitCV = async (req, res) => {
    try {
        const userId = req.user.uid; // Ambil userId dari token Firebase
        const cvData = req.body; // Data CV dari request body

        // Validasi input
        if (!cvData.personal_info || !cvData.personal_info.name) {
            return res.status(400).json({ success: false, message: 'Personal info with name is required' });
        }

        let photoUrl = null;

        // Periksa apakah file diupload
        if (req.file) {
            const fileName = `photos/${Date.now()}-${req.file.originalname}`;
            const file = bucket.file(fileName);

            // Upload file ke Firebase Storage
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            // Dapatkan URL publik untuk file
            photoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        // Buat ID unik untuk CV
        const cvId = db.collection('cvs').doc().id;

        // Simpan data ke Firestore
        const newCV = {
            userId,
            cvId,
            photoUrl, // Tambahkan URL foto ke data CV
            ...cvData,
            createdAt: new Date().toISOString()
        };

        await db.collection('cvs').doc(cvId).set(newCV);

        res.status(201).json({ success: true, message: 'CV submitted successfully', cv: newCV });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error submitting CV', error: error.message });
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