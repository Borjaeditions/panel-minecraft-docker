const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Almacenamiento temporal en memoria para procesamiento con Sharp
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    cb(null, allowed.includes(file.mimetype));
  }
});

const saveCompressedImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const userId = req.user?.id || req.userId || 'default';
    const username = req.user?.username || 'usuario';

    const baseDir = path.join(__dirname, '..', 'uploads', userId, 'perfil');
    fs.mkdirSync(baseDir, { recursive: true });

    // Sanitizar nombre
    const cleanUsername = username.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${Date.now()}_${cleanUsername}_profile.jpg`;

    const finalPath = path.join(baseDir, filename);

    await sharp(req.file.buffer)
      .resize({ width: 500 }) // Ajuste de tamaño opcional
      .jpeg({ quality: 70 })  // Compresión JPEG
      .toFile(finalPath);

    // Ruta relativa útil para devolver al cliente
    req.savedFilePath = `/uploads/${userId}/perfil/${filename}`;
    next();
  } catch (error) {
    console.error('Error al comprimir/guardar imagen:', error);
    res.status(500).json({ error: 'Fallo al guardar la imagen' });
  }
};

module.exports = { upload, saveCompressedImage };
