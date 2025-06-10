const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const logAcceso = require('./middleware/logAcceso');

app.use(express.json());
app.use(logAcceso);

// 🔁 Tabla de rutas y destinos internos
const services = [
  {
    route: '/auth',
    target: 'http://auth-service:3000'
  },
  {
    route: '/users',
    target: 'http://user-service:3000'
  },
  {
    route: '/worlds',
    target: 'http://world-service:3000'
  },
  {
    route: '/docker',
    target: 'http://host.docker.internal:5050'
  }
];

// 🔄 Registrar todas las rutas dinámicamente
services.forEach(({ route, target }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(route, '')
  }));
});

// Ruta fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada en el API Gateway' });
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB para logs');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🌐 API Gateway escuchando en el puerto ${PORT} externo 4000`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });
