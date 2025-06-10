const axios = require('axios');
const mongoose = require('mongoose');

// Esquema Mongo para logs
const LogSchema = new mongoose.Schema({
  ip: String,
  ruta: String,
  metodo: String,
  userAgent: String,
  origen: String,
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', LogSchema);

// Función para consultar información de IP (puede usarse ipinfo.io, ip-api.com, etc.)
async function obtenerOrigen(ip) {
  try {
    const res = await axios.get(`http://ip-api.com/json/${ip}`);
    if (res.data && res.data.country) {
      return `${res.data.city}, ${res.data.country}`;
    }
  } catch (err) {
    console.error('Error al obtener ubicación de IP:', err.message);
  }
  return 'Desconocido';
}

// Enviar log a Telegram
async function enviarLogTelegram(mensaje) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: mensaje,
    });
  } catch (err) {
    console.error('Error al enviar log a Telegram:', err.message);
  }
}

// Middleware
async function logAcceso(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ruta = req.originalUrl;
  const metodo = req.method;
  const userAgent = req.headers['user-agent'] || 'desconocido';
  const origen = await obtenerOrigen(ip);

  const log = new Log({ ip, ruta, metodo, userAgent, origen });
  await log.save();

  const mensaje = `📡 Acceso:\\nIP: ${ip}\\nRuta: ${metodo} ${ruta}\\nUbicación: ${origen}`;
  await enviarLogTelegram(mensaje);

  next();
}

module.exports = logAcceso;