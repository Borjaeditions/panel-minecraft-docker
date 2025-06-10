require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const worldRoutes = require('./routes/world.routes');

// Middlewares
app.use(express.json());

// Rutas
app.use('/worlds', worldRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🌍 World-service corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
  });
