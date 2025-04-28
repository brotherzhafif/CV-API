const { initializeApp } = require('firebase/app'); // Impor initializeApp
const { getAuth } = require('firebase/auth'); // Impor getAuth untuk autentikasi

// Konfigurasi Firebase Client SDK
const firebaseConfig = {
    apiKey: "AIzaSyDrAdBBJ8X4dJ-7Y1_3N7MXOtN7whDYrj0",
    authDomain: "cv-generator-maxy.firebaseapp.com",
    projectId: "cv-generator-maxy",
    storageBucket: "cv-generator-maxy.appspot.com",
    messagingSenderId: "256251896360",
    appId: "1:256251896360:web:a121f1199cd27e3bfb8b1d"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor instance auth
const auth = getAuth(app);
module.exports = { auth };