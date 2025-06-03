# 🎮 Minecraft Panel - Plataforma de Administración de Servidores

Este proyecto es una plataforma modular para administrar servidores de Minecraft. Cada servidor (mundo) es lanzado en un contenedor Docker independiente, controlado a través de microservicios. Los usuarios pueden crear mundos, asignar subdominios personalizados y configurar listas blancas de jugadores.

---

## 📦 Servicios del Proyecto

| Servicio             | Descripción                                               |
|----------------------|-----------------------------------------------------------|
| `auth-service`       | Autenticación con JWT (login, refresh token, logout)      |
| `user-service`       | Manejo de usuarios, fotos de perfil, y plan contratado    |
| `world-service`      | Creación y administración de mundos Minecraft             |
| `docker-control-service` | Encargado de levantar/detener contenedores Docker    |
| `api-gateway`        | Gateway que expone las rutas de todos los servicios       |
| `mongo`              | Base de datos MongoDB para persistencia (usuarios/mundos) |

---

## 🧠 Arquitectura General

- **Node.js + Express** por microservicio
- **MongoDB** para almacenar usuarios y mundos
- **Docker** para contenerización de servicios y mundos Minecraft
- **API Gateway** para simplificar el consumo desde frontend
- **Subdominios dinámicos** por mundo, configurables con Cloudflare (futuro)
- **Control de puertos únicos** para evitar conflictos entre mundos
- **Whitelist y acceso abierto** configurables por cada mundo

---

## 🚀 Cómo iniciar el proyecto

```bash
# Clona el repositorio
git clone https://github.com/tuusuario/minecraft-panel-modular.git
cd minecraft-panel-modular

# Levanta los servicios (Linux recomendado)
docker compose up --build
```

Requiere tener instalado:

- Docker + Docker Compose
- Node.js 20+ (para desarrollo local)

---

## 🌍 world-service

### `POST /worlds`
Crea un nuevo mundo para el usuario autenticado.

**Body JSON**:
```json
{
  "name": "MiPrimerMundo",
  "planKey": "basic",
  "whitelist": ["uuid1", "uuid2"],
  "accessType": "whitelist", // o "public"
  "allowCracked": true
}
```

### `GET /worlds`
Devuelve todos los mundos del usuario autenticado.

### `PATCH /worlds/:id/access`
Actualiza el tipo de acceso (whitelist o público).

### `DELETE /worlds/:id`
Elimina el mundo y su contenedor correspondiente.

---

## 🔐 auth-service

- `POST /login`
- `POST /refresh-token`
- `POST /logout`

Autenticación con JWT y refresh token.

---

## 👤 user-service

- `GET /users`
- `POST /users/photo`
- Lógica de planes: cada usuario tiene un límite de mundos según el plan.

---

## ⚙️ docker-control-service

API local que ejecuta scripts en el host (fuera de contenedor):

- `POST /containers/start`
- `DELETE /containers/:subdomain`
- `POST /containers/:subdomain/whitelist`

Asegura que Node.js no interactúe directamente con Docker desde dentro del contenedor.

---

## 📁 Estructura del proyecto

```
minecraft-panel/
├── auth-service/
├── user-service/
├── world-service/
├── docker-control-service/
├── api-gateway/
├── docker-compose.yml
└── README.md
```

---

## ✨ Planes disponibles (plans.json)

```json
[
  {
    "key": "basic",
    "name": "Plan Básico",
    "playerRange": "5+",
    "ramGB": 2,
    "allowMods": false,
    "allowPlugins": false,
    "mode": "survival"
  },
  {
    "key": "pro",
    "name": "Plan Pro",
    "playerRange": "10+",
    "ramGB": 4,
    "allowMods": true,
    "allowPlugins": true,
    "mode": "creative"
  }
]
```

---

## 🌐 Subdominios

Cada mundo generado obtiene un subdominio único. En producción, se vinculará con la API de Cloudflare para exponerlo públicamente mediante HTTPS (Cloudflare Tunnel u Nginx).

---

## 🛡️ Seguridad

- Sanitización de entradas para evitar inyecciones
- Validación de UUIDs en whitelist
- Control de acceso basado en JWT
- Puertos únicos por mundo (con asignación y liberación automática)

---

## 📌 Próximos pasos

- Interfaz web (frontend Angular o React)
- Configuración automática de subdominios con Cloudflare
- Panel de administración
- Soporte para backups y restauración de mundos
- Gestión de mods/plugins desde el frontend

---

## 👨‍💻 Autor

Alejandro Borja Hernández – [borjaeditions.com](https://borjaeditions.com)
