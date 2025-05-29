const User = require('../models/User');

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { username, email, nombre, rol, fotoPerfil } = req.body;

    const nuevoUsuario = new User({ username, email, nombre, rol, fotoPerfil });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Obtener todos los usuariosme p
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Actualizar usuario
// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      updateData.fotoPerfil = `/uploads/${req.file.filename}`;
    }

    const usuario = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario actualizado', user: usuario });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};


// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};
