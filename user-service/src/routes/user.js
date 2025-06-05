const express = require('express');
const router = express.Router();
const { upload, saveCompressedImage } = require('../middlewares/upload');
const verifyToken = require('../middlewares/verifyToken');
const userController = require('../controllers/userController'); // <- Faltaba esto

// Rutas CRUD de usuario protegidas
router.post('/', verifyToken, userController.crearUsuario);
router.get('/', verifyToken, userController.obtenerUsuarios);
router.get('/:id', verifyToken, userController.obtenerUsuarioPorId);
router.put('/:id', verifyToken, upload.single('fotoPerfil'), userController.actualizarUsuario);
router.delete('/:id', verifyToken, userController.eliminarUsuario);

// Ruta para subir imagen de perfil
router.post('/upload', verifyToken, upload.single('file'), saveCompressedImage, (req, res) => {
  res.json({ message: 'Imagen guardada', path: req.savedFilePath });
});

module.exports = router;
