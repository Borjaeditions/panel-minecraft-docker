const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, email });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: 'Registro fallido', detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, refreshToken });
});

router.get('/verify', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});
router.post('/profile-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    // Guardamos la ruta relativa (puedes cambiarla a URL pública si usas dominio)
    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.userId, { profileImage: imagePath }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Imagen actualizada', profileImage: imagePath });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token no proporcionado' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const token = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
});
router.post('/logout', (req, res) => {
  // Aquí podrías invalidar el refresh token si lo almacenas
  res.json({ message: 'Logout exitoso (manual)' });
});


module.exports = router;
