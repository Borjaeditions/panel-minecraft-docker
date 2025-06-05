
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');


// Configuración de multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/**
 * GET /users - Lista de usuarios
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

/**
 * GET /users/:id - Ver perfil
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

/**
 * GET /users/:id/foto - Ver foto de perfil
 */
router.get('/:id/foto', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.fotoPerfil) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    const rutaFoto = path.join(__dirname, '../../uploads', user.fotoPerfil);
    if (!fs.existsSync(rutaFoto)) {
      return res.status(404).json({ message: 'Archivo no existe en el servidor' });
    }

    res.sendFile(rutaFoto);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la foto' });
  }
});

// Obtiene los datos del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    console.error('Error en /me:', err.message);
    res.status(500).json({ message: 'Error del servidor' });
  }
});



/**
 * PUT /users/me - Editar perfil autenticado
 */
router.put('/me', verifyToken, upload.single('fotoPerfil'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (req.file) {
      if (user.fotoPerfil) {
        const rutaAnterior = path.join(__dirname, '../../uploads', user.fotoPerfil);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }
      user.fotoPerfil = req.file.filename;
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();
    res.json({ message: 'Perfil actualizado', user });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el perfil', detail: err.message });
  }
});

// DELETE /users/me - Eliminar cuenta
router.delete('/me', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cuenta', detail: err.message });
  }
});

// PATCH /users/:id/rol - Cambiar rol de usuario (solo admin)
router.patch('/:id/rol', verifyToken, isAdmin, async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['user', 'admin'].includes(rol)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol actualizado', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el rol', detail: err.message });
  }
});

module.exports = router;
