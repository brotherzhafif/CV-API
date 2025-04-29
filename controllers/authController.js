const { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } = require('firebase/auth'); // Impor fungsi modular
const { auth } = require('../config/firebaseConfig'); // Firebase Client SDK untuk autentikasi
const { db } = require('../config/firebase'); // Firestore dari Firebase Admin SDK

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validasi input
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan username wajib diisi',
      });
    }

    // Registrasi user ke Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Simpan username di database (opsional, jika menggunakan Firestore atau Realtime Database)
    await db.collection('users').doc(user.uid).set({
      username,
      email
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: user.uid,
        email: user.email,
        username: username, // Tambahkan username ke respons
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validasi input
    if ((!email || !username) && !password) {
      return res.status(400).json({
        success: false,
        message: 'Email atau username, dan password wajib diisi',
      });
    }

    let userCredential;

    if (email) {
      // Login menggunakan email
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else if (username) {
      const userDoc = await db.collection('users').where('username', '==', username).get();

      if (userDoc.empty) {
        throw new Error('Username tidak ditemukan');
      }

      const userEmail = userDoc.docs[0].data().email; // Ambil email dari Firestore
      userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
    }

    const user = userCredential.user;
    const token = await user.getIdToken();

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.uid,
        email: user.email,
        username: username || null, // Tambahkan username jika tersedia
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Email, username, atau password salah',
      error: error.message,
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const provider = new GoogleAuthProvider();

    // Login menggunakan Google
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const token = await user.getIdToken();

    res.json({
      success: true,
      message: 'Login dengan Google berhasil',
      token,
      user: {
        id: user.uid,
        email: user.email,
        displayName: user.displayName, // Nama pengguna dari Google
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal login dengan Google',
      error: error.message,
    });
  }
};