const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_URL = process.env.AUTH_SERVICE_URL;

// Reenvía login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_URL}/auth/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Error en auth-service' });
  }
});

// Reenvía registro
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_URL}/auth/register`, req.body);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Error en auth-service' });
  }
});
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
});


module.exports = router;
