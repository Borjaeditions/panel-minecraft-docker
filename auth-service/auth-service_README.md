# auth-service

Microservicio de autenticación para la plataforma de gestión de mundos de Minecraft. Maneja el login, registro, emisión y validación de tokens JWT, así como el refresh token y logout.

---

## 📦 Endpoints

### `POST /auth/register`
Registra un nuevo usuario.

- **Body (JSON):**
```json
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

### `POST /auth/login`
Inicia sesión y devuelve un access token + refresh token.

- **Body (JSON):**
```json
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

- **Response:**
```json
{
  "accessToken": "<token>",
  "refreshToken": "<token>"
}
```

### `POST /auth/refresh`
Devuelve un nuevo access token si el refresh token es válido.

- **Body (JSON):**
```json
{
  "refreshToken": "<token>"
}
```

### `POST /auth/logout`
Cierra sesión eliminando el refresh token del almacenamiento.

- **Body (JSON):**
```json
{
  "refreshToken": "<token>"
}
```

---

## 🧪 Uso con Postman

### Registro
- **POST** `http://localhost:4000/auth/register`
- **Body:**
```json
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

### Login
- **POST** `http://localhost:4000/auth/login`
- **Body:**
```json
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

---

## 🧪 Uso con cURL

### Registro
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com", "password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com", "password":"123456"}'
```

### Refresh Token
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<token>"}'
```

### Logout
```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<token>"}'
```

---

## ⚙️ Variables de entorno (.env)

```env
JWT_SECRET=una_clave_segura
JWT_EXPIRES_IN=15m
REFRESH_SECRET=otra_clave_segura
REFRESH_EXPIRES_IN=7d
MONGO_URI=mongodb://mongo:27017/auth-db
```

---

## 🚀 Ejecución local

```bash
npm install
npm run dev
```

> Asegúrate de tener MongoDB corriendo y un archivo `.env` configurado.