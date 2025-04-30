const express = require('express');
const app = express();
const cors = require('cors');

const cvRoutes = require('./routes/cvRoutes');
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cvRoutes);
app.use('/auth', authRoutes);

// Ekspor handler untuk Vercel
module.exports = app;

// Start server (hanya untuk pengembangan lokal)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}