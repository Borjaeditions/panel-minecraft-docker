const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // expira automáticamente en 7 días
});

module.exports = mongoose.model('Token', TokenSchema);