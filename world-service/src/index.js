require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const worldRoutes = require('./routes/world.routes')

app.use(express.json())
app.use('/worlds', worldRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
      console.log(`World service listening on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.error(err))

const worldSchema = new mongoose.Schema({
  name: String,
  owner: mongoose.Schema.Types.ObjectId,
  port: Number,
  subdomain: String,
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