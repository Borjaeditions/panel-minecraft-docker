const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload'); // Aquí importamos multer

// Rutas CRUD de usuario
router.post('/', userController.crearUsuario);
router.get('/', userController.obtenerUsuarios);
router.get('/:id', userController.obtenerUsuarioPorId);

// Aquí usamos multer para aceptar una imagen en el campo 'fotoPerfil'
router.put('/:id', upload.single('fotoPerfil'), userController.actualizarUsuario);

router.delete('/:id', userController.eliminarUsuario);

module.exports = router;
