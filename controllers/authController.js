const { auth } = require('../config/firebaseConfig'); // Impor auth dari konfigurasi Firebase
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth'); // Impor fungsi modular

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Registrasi user ke Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: user.uid,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Login user ke Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Dapatkan token Firebase
    const token = await user.getIdToken();

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.uid,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Email atau password salah',
      error: error.message
    });
  }
};