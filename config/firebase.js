require('dotenv').config(); // Tambahkan ini di bagian atas
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com` // Tambahkan bucket default
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Inisialisasi bucket

module.exports = { admin, db, bucket };