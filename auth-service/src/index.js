require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

connectDB();
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔐 Auth-service corriendo en puerto ${PORT}`));
