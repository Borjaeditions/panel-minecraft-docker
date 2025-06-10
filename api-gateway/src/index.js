
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const logAcceso = require('./middleware/logAcceso');

app.use(express.json());
app.use(logAcceso);

// Rutas proxy
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:4000',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

app.use('/users', createProxyMiddleware({
  target: 'http://user-service:4002',
  changeOrigin: true,
  pathRewrite: { '^/users': '' }
}));

app.use('/worlds', createProxyMiddleware({
  target: 'http://world-service:4003',
  changeOrigin: true,
  pathRewrite: { '^/worlds': '' }
}));

app.use('/docker', createProxyMiddleware({
  target: 'http://host.docker.internal:5050',
  changeOrigin: true,
  pathRewrite: { '^/docker': '' }
}));

// Error 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada en el API Gateway' });
});

// Conexión a Mongo para logs
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB para logs');
    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => console.log(`🌐 API Gateway escuchando en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB para logs:', err.message);
  });
