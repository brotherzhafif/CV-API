const express = require('express');
const app = express();
const cors = require('cors');
const cvRoutes = require('./routes/cvRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cvRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
