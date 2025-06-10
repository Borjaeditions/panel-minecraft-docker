const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

// Services locales por nombre de contenedor
const services = [
  { route: "/auth", target: "http://auth-service:3000" },
  { route: "/users", target: "http://user-service:3000" },
  { route: "/worlds", target: "http://world-service:3000" },
  { route: "/docker", target: "http://host.docker.internal:5050" }
];

// Rate limit simple
const rateLimit = 20;
const interval = 60 * 1000;
const requestCounts = {};

setInterval(() => {
  Object.keys(requestCounts).forEach(ip => requestCounts[ip] = 0);
}, interval);

function rateLimitAndTimeout(req, res, next) {
  const ip = req.ip;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > rateLimit) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(15000, () => {
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.destroy();
  });

  next();
}

app.use(rateLimitAndTimeout);

services.forEach(({ route, target }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  }));
});

// Fallback para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada en el API Gateway" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 API Gateway corriendo en el puerto ${PORT} externo 4000`)
);
