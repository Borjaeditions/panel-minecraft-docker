// src/models/World.js
const mongoose = require('mongoose')

const worldSchema = new mongoose.Schema({
  name: String,
  owner: mongoose.Schema.Types.ObjectId,
  port: Number,
  subdomain: {
    type: String,
    unique: true,
    sparse: true // por si aún no se ha asignado al crear
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
})

// Índice único para evitar mundos duplicados por nombre y dueño
worldSchema.index({ name: 1, owner: 1 }, { unique: true })
// Índice único para subdominios (global)
worldSchema.index({ subdomain: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('World', worldSchema)
