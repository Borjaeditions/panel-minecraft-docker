// src/models/World.js
const mongoose = require('mongoose');

const worldSchema = new mongoose.Schema({
  name: String,
  owner: mongoose.Schema.Types.ObjectId,
  port: Number,
  subdomain: {
    type: String,
    unique: true,
    sparse: true
  },
  mode: String,
  ramGB: Number,
  allowMods: Boolean,
  allowPlugins: Boolean,
  planName: String,
  maxPlayers: Number,
  accessType: {
    type: String,
    enum: ['whitelist', 'public'],
    default: 'whitelist'
  },
  whitelist: [String],
  allowCracked: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.World || mongoose.model('World', worldSchema);