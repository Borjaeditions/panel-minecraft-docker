const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  plan: { type: String, default: 'free' }
});

module.exports = mongoose.model('User', userSchema);
