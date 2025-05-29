# 🎮 Minecraft Panel - Plataforma de Administración de Servidores

Este proyecto es una plataforma modular desarrollada con microservicios para administrar servidores de Minecraft de forma eficiente y escalable. Ideal para ofrecer servicios comerciales a múltiples usuarios con autenticación, control de acceso y gestión de mundos.

---

## 📦 Estructura de Microservicios

```bash
minecraft-panel/
├── docker-compose.yml
├── auth-service/         # Servicio de autenticación con JWT y Refresh Token
├── user-service/         # Gestión de usuarios con CRUD y subida de foto de perfil
├── api-gateway/          # Gateway para enrutamiento centralizado de los microservicios
└── mongo/                # Base de datos MongoDB (contenedor)
```

---

## 🚀 Tecnologías

- **Node.js** + **Express**
- **MongoDB** con Mongoose
- **JWT** para autenticación segura
- **Multer** para manejo de archivos (foto de perfil)
- **Docker + Docker Compose**
- **Postman** para pruebas de endpoints

---

## 🔧 Instrucciones de Uso

### 1. Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/minecraft-panel.git
cd minecraft-panel
```

### 2. Configura variables de entorno

Crea un archivo `.env` dentro de cada microservicio con las siguientes variables:

#### auth-service/.env

```
PORT=3000
JWT_SECRET=tu_clave_secreta
JWT_REFRESH_SECRET=tu_refresh_clave
MONGO_URI=mongodb://mongo:27017/minecraft-auth
```

#### user-service/.env

```
PORT=3000
MONGO_URI=mongodb://mongo:27017/minecraft-users
```

#### api-gateway/.env

```
PORT=3000
AUTH_SERVICE_URL=http://auth-service:3000
USER_SERVICE_URL=http://user-service:3000
```

---

### 3. Construir y levantar servicios

```bash
docker-compose up --build
```

Los servicios se expondrán así:

- **Auth Service:** http://localhost:4000
- **User Service:** http://localhost:4002 (ajústalo si cambias)
- **API Gateway:** http://localhost:4001

---

## 🔐 Endpoints Clave

- `POST /auth/register` – Registro de usuarios
- `POST /auth/login` – Login y obtención de token
- `POST /auth/refresh` – Refresh del JWT
- `POST /auth/logout` – Logout

- `GET /users` – Listar usuarios
- `PUT /users/:id` – Actualizar (incluye subida de foto)
- `DELETE /users/:id` – Eliminar usuario

Accede a través del `api-gateway` con prefijos como `/api/auth`, `/api/users`, etc.

---

## 📁 Subida de Fotos

En el endpoint `PUT /users/:id`, puedes enviar un `form-data` con el campo `fotoPerfil` (imagen).

---

## 🛡️ Seguridad

- JWT de acceso y refresh
- Validación de usuario autenticado
- Pruebas con Postman disponibles

---

## 🧠 Autor

Desarrollado por **Alejandro Borja Hernández**

> 💻 Proyecto en desarrollo con enfoque comercial para gestión de servidores Minecraft.
