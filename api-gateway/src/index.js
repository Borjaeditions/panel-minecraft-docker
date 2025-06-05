// src/index.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');

const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/users', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/users': '' }
}));

app.use(express.json());

app.use('/auth', authRoutes);

// Futuras rutas de microservicios
// app.use('/user', require('./routes/user'));
// app.use('/world', require('./routes/world'));

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en puerto ${PORT}`);
});

// src/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

// src/routes/auth.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';

router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Error interno' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Error interno' });
  }
});

module.exports = router;
