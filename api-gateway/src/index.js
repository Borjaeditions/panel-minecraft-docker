// src/index.js
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

module.exports = router;
