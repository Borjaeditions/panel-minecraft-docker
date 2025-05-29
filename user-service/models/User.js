const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nombre: { type: String },
  rol: { type: String, enum: ['user', 'admin'], default: 'user' },
  fotoPerfil: { type: String, default: '' }, // Ruta de imagen
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
