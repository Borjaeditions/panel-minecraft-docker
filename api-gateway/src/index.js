require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');

const app = express();
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Ruta protegida de prueba
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚪 API Gateway corriendo en puerto ${PORT}`));
