
# 🧑‍💼 User Service

Este microservicio gestiona la información de los usuarios del sistema de administración de mundos de Minecraft, incluyendo fotos de perfil, límites por plan, y detalles públicos de otros usuarios.

## 📦 Endpoints

### 🔒 GET /users
Obtiene todos los usuarios (solo admins).

**Headers:**
- `Authorization: Bearer <token>`

**Curl:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:4002/users
```

**Postman:**
- Método: GET
- URL: `http://localhost:4002/users`
- Header: `Authorization: Bearer <token>`

---

### 👤 GET /users/:id
Obtiene los datos públicos de un usuario por su ID.

**Curl:**
```bash
curl http://localhost:4002/users/USER_ID
```

**Postman:**
- Método: GET
- URL: `http://localhost:4002/users/USER_ID`

---

### 🖼️ POST /users/:id/photo
Sube una foto de perfil para un usuario.

**Body (form-data):**
- `photo`: archivo .jpg/.png

**Curl:**
```bash
curl -F "photo=@foto.png" http://localhost:4002/users/USER_ID/photo
```

**Postman:**
- Método: POST
- URL: `http://localhost:4002/users/USER_ID/photo`
- Body → form-data: `photo` como archivo

---

## 🛠️ Uso

Este servicio expone endpoints REST con protección JWT. Asegúrate de enviar el token en los headers cuando sea requerido.

## ⚙️ Docker

Expone el puerto `4002` (host) → `3000` (contenedor).

**Ejecutar con Docker:**
```bash
docker-compose up -d user-service
```

## 📁 Estructura

```
user-service/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middlewares/
│
├── uploads/    # Fotos de perfil
├── .env
├── Dockerfile
└── package.json
```
