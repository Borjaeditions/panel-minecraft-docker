# 🌍 World Service

Servicio encargado de la creación y administración de mundos Minecraft para cada usuario autenticado.

## 📁 Endpoints

### 1. Obtener mundos del usuario
- **GET** `/worlds`
- **Headers:** `user-id: <UUID>`
- **Respuesta:** Lista de mundos del usuario.

#### 📦 cURL
```bash
curl -H "user-id: <UUID>" http://localhost:3002/worlds
```

#### 🔧 Postman
- Método: GET
- URL: `http://localhost:3002/worlds`
- Headers: `user-id: <UUID>`

---

### 2. Crear un nuevo mundo
- **POST** `/worlds`
- **Headers:** `user-id: <UUID>`
- **Body JSON:**
```json
{
  "name": "Mi Mundo",
  "planKey": "starter",
  "accessType": "whitelist",  // o "public"
  "whitelist": ["usuario1", "usuario2"],
  "allowCracked": true
}
```

#### 📦 cURL
```bash
curl -X POST http://localhost:3002/worlds \
 -H "Content-Type: application/json" \
 -H "user-id: <UUID>" \
 -d '{"name":"Mi Mundo","planKey":"starter","accessType":"whitelist","whitelist":["usuario1"],"allowCracked":true}'
```

#### 🔧 Postman
- Método: POST
- URL: `http://localhost:3002/worlds`
- Headers: `user-id: <UUID>`
- Body: raw JSON como el ejemplo anterior.

---

### 3. Actualizar acceso
- **PUT** `/worlds/:id/access`
- **Body JSON:**
```json
{
  "accessType": "public",
  "whitelist": [],
  "allowCracked": true
}
```

#### 📦 cURL
```bash
curl -X PUT http://localhost:3002/worlds/<id>/access \
 -H "Content-Type: application/json" \
 -d '{"accessType":"public","whitelist":[],"allowCracked":true}'
```

---

### 4. Eliminar un mundo
- **DELETE** `/worlds/:id`

#### 📦 cURL
```bash
curl -X DELETE http://localhost:3002/worlds/<id>
```

---

## 📦 Docker

Este servicio espera conectarse con:
- MongoDB (puerto `27017`)
- `docker-control-service` en `http://host.docker.internal:5050`

Puerto por defecto: `3002`

---

## 📘 Notas

- Usa `plans.json` para validar configuración por tipo de mundo.
- La creación asigna subdominios únicos y puertos libres automáticamente.
- Solo se permite un mundo por nombre por usuario.
