
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const rateLimit = require('express-rate-limit');
const logAcceso = require('./middleware/logAcceso');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo 100 peticiones por IP
  message: 'Demasiadas solicitudes, intenta más tarde.'
});

app.use(limiter);
app.use(logAcceso);


app.use(express.json());

// Proxy hacia auth-service (puerto interno 4000)
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:4000',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

// Proxy hacia user-service (puerto interno 4002)
app.use('/users', createProxyMiddleware({
  target: 'http://user-service:4002',
  changeOrigin: true,
  pathRewrite: { '^/users': '' }
}));

// Proxy hacia world-service (puerto interno 4003)
app.use('/worlds', createProxyMiddleware({
  target: 'http://world-service:4003',
  changeOrigin: true,
  pathRewrite: { '^/worlds': '' }
}));

// Proxy hacia docker-control-service (puerto interno 5050)
app.use('/docker', createProxyMiddleware({
  target: 'http://docker-control-service:5050',
  changeOrigin: true,
  pathRewrite: { '^/docker': '' }
}));

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada en el API Gateway' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway escuchando en el puerto ${PORT}`);
});
