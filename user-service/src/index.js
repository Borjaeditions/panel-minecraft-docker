require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/uploads', express.static('uploads'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => console.log(`🚀 User-service corriendo en puerto ${PORT}`));
})
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));
