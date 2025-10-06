# 🏥 Hospital ColmenaLab API

Microservicio para gestión hospitalaria desarrollado con NestJS, PostgreSQL y JWT.

## 🚀 Tecnologías

- **NestJS 11** - Framework backend
- **TypeScript** - Lenguaje de programación
- **PostgreSQL 16** - Base de datos relacional
- **TypeORM** - ORM para manejo de datos
- **JWT** - Autenticación y autorización
- **Passport** - Estrategias de autenticación
- **Swagger/OpenAPI** - Documentación interactiva de API
- **Docker & Docker Compose** - Contenedorización
- **Class Validator** - Validación de DTOs
- **Bcrypt** - Hash de contraseñas

## 📋 Prerequisitos

- Node.js 20+
- Docker y Docker Compose
- pnpm (recomendado) o npm

## 🔧 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd Nest-ColmenaLab-api

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Levantar servicios
docker compose up -d

# Ver logs
docker compose logs -f app
```

La API estará disponible en: **http://localhost:3000/api/v1**

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Levantar solo PostgreSQL
docker compose up -d postgres

# Iniciar en modo desarrollo
pnpm run start:dev
```

## 📚 Documentación API

Accede a Swagger UI: **http://localhost:3000/api/v1/docs**

La documentación interactiva incluye:
- Todos los endpoints disponibles
- Modelos de datos
- Ejemplos de peticiones y respuestas
- Prueba de endpoints en vivo

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación y control de acceso basado en roles.

### 1. Registrar Usuario

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@hospital.com",
  "password": "admin123",
  "role": "admin"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "uuid",
    "username": "admin",
    "email": "admin@hospital.com",
    "role": "admin"
  }
}
```

### 2. Iniciar Sesión

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 3. Usar Token de Autenticación

**En Swagger:**
1. Copiar `access_token` de la respuesta de login/register
2. Click en el botón 🔒 **Authorize** (esquina superior derecha)
3. Pegar el token en el campo
4. Click en **Authorize**
5. Ahora puedes probar endpoints protegidos

**En Postman/Thunder Client:**
```
Authorization: Bearer {access_token}
```

**Con cURL:**
```bash
curl http://localhost:3000/api/v1/patients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 👥 Roles de Usuario

El sistema implementa control de acceso basado en roles:

- **admin** - Acceso completo a todos los recursos
- **doctor** - Gestión de pacientes, citas y órdenes médicas
- **patient** - Acceso de solo lectura a sus propios datos

## 🗂️ Módulos Implementados

### 1. Gestión de Pacientes

**Endpoints:**
- `POST /patients` - Registrar paciente
- `GET /patients` - Listar todos los pacientes
- `GET /patients/search?id={identificacion}` - Buscar por identificación
- `GET /patients/:id` - Obtener paciente por UUID
- `PATCH /patients/:id` - Actualizar paciente
- `DELETE /patients/:id` - Eliminar paciente

**Características:**
- CRUD completo
- Validación de identificación única
- Validación de email único
- Búsqueda por número de identificación

### 2. Gestión de Médicos

**Endpoints:**
- `POST /doctors` - Registrar médico
- `GET /doctors` - Listar todos los médicos
- `GET /doctors/search?id={identificacion}` - Buscar por identificación
- `GET /doctors/:id` - Obtener médico por UUID
- `PATCH /doctors/:id` - Actualizar médico
- `DELETE /doctors/:id` - Eliminar médico

**Características:**
- Campos adicionales: tarjeta profesional, fecha de ingreso
- Validación de tarjeta profesional única
- Hereda todos los campos de paciente

### 3. Gestión de Citas Médicas

**Endpoints:**
- `POST /appointments` - Programar cita
- `GET /appointments` - Listar todas las citas
- `GET /appointments/available-doctors?date=YYYY-MM-DD` - Médicos disponibles
- `GET /appointments/search?patientId={id}&date={fecha}` - Buscar por paciente y fecha
- `GET /appointments/:id` - Obtener cita específica
- `PATCH /appointments/:id/status` - Actualizar estado de cita
- `DELETE /appointments/:id` - Cancelar cita

**Características:**
- Validación de disponibilidad de médicos
- Estados: PROGRAMADA, ASISTIO, NO_ASISTIO
- Consulta de médicos disponibles por fecha
- Timestamp de actualización de estado
- Relación con órdenes médicas

### 4. Órdenes Médicas

**Endpoints:**
- `POST /medical-orders` - Crear orden médica
- `GET /medical-orders/appointment/:appointmentId` - Órdenes de una cita
- `GET /medical-orders/:id` - Obtener orden específica
- `DELETE /medical-orders/:id` - Eliminar orden

**Características:**
- Asociación a citas médicas
- Relación Many-to-Many con medicamentos
- Fecha de caducidad y especialidad
- Descripción de la orden

### 5. Medicamentos

**Endpoints:**
- `POST /medications` - Registrar medicamento
- `GET /medications` - Listar medicamentos
- `GET /medications/:id` - Obtener medicamento específico
- `DELETE /medications/:id` - Eliminar medicamento

**Características:**
- Nombre, descripción y enfermedades
- Relación con órdenes médicas
- Gestión de prescripciones

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/                 # Autenticación JWT
│   │   ├── decorators/       # @Public(), @Roles()
│   │   ├── dto/              # Login, Register DTOs
│   │   ├── entities/         # User entity
│   │   ├── guards/           # JWT & Roles guards
│   │   └── strategies/       # JWT strategy
│   ├── patients/             # Gestión de pacientes
│   ├── doctors/              # Gestión de médicos
│   ├── appointments/         # Gestión de citas
│   ├── medical-orders/       # Órdenes médicas
│   └── medications/          # Medicamentos
├── common/
│   ├── decorators/           # Decoradores compartidos
│   ├── enums/                # Enumeraciones
│   ├── exceptions/           # Excepciones de negocio
│   └── filters/              # Exception filters
├── config/                   # Configuraciones
│   ├── configuration.ts      # Variables de entorno
│   └── validation.schema.ts  # Validación de .env
└── database/                 # Migraciones y seeds
```

### Capas de la Aplicación

1. **Controllers** - Manejo de peticiones HTTP
2. **Services** - Lógica de negocio
3. **Repositories** - Acceso a datos (TypeORM)
4. **DTOs** - Validación de datos de entrada
5. **Entities** - Modelos de base de datos
6. **Guards** - Protección de rutas
7. **Filters** - Manejo global de excepciones

## 🔑 Variables de Entorno

```env
# Aplicación
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=hospital_colmenalab

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d
```

## 🐳 Comandos Docker

```bash
# Levantar todos los servicios
docker compose up -d

# Levantar solo base de datos
docker compose up -d postgres

# Ver logs de la aplicación
docker compose logs -f app

# Ver logs de PostgreSQL
docker compose logs -f postgres

# Detener servicios
docker compose down

# Limpiar volúmenes (elimina datos de BD)
docker compose down -v

# Reconstruir imágenes
docker compose up -d --build
```

## 📊 Base de Datos

### Tablas Principales

- `users` - Usuarios del sistema
- `patients` - Información de pacientes
- `doctors` - Información de médicos
- `appointments` - Citas médicas
- `medical_orders` - Órdenes médicas
- `medications` - Medicamentos
- `medical_order_medications` - Relación órdenes-medicamentos

### Migraciones

TypeORM está configurado en modo `synchronize: true` solo en desarrollo. Para producción, usar migraciones:

```bash
# Generar migración
pnpm run migration:generate -- nombre_migracion

# Ejecutar migraciones
pnpm run migration:run

# Revertir última migración
pnpm run migration:revert
```

## 🛡️ Seguridad

- Autenticación JWT con tokens de acceso
- Hash de contraseñas con bcrypt (10 rounds)
- Validación de entrada con class-validator
- Guards de autorización basados en roles
- Exception filters para manejo seguro de errores
- CORS habilitado y configurable
- Sanitización de datos de entrada

## 🌐 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión

### Pacientes
- `GET /patients` - Listar pacientes
- `POST /patients` - Crear paciente
- `GET /patients/search?id={identificacion}` - Buscar por ID

### Médicos
- `GET /doctors` - Listar médicos
- `POST /doctors` - Registrar médico
- `GET /doctors/search?id={identificacion}` - Buscar por ID

### Citas
- `GET /appointments/available-doctors?date=2025-10-15` - Médicos disponibles
- `POST /appointments` - Crear cita
- `PATCH /appointments/:id/status` - Actualizar estado

### Órdenes y Medicamentos
- `POST /medical-orders` - Crear orden médica
- `GET /medications` - Listar medicamentos

## 📝 Convenciones de Código

### Commits
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento

### Naming
- Variables y funciones: `camelCase`
- Clases y interfaces: `PascalCase`
- Archivos: `kebab-case`
- Constantes: `UPPER_SNAKE_CASE`

## 🚧 Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Sistema de notificaciones
- [ ] Historial médico de pacientes
- [ ] Reportes y estadísticas
- [ ] Integración con servicios externos
- [ ] Rate limiting
- [ ] Caché con Redis
- [ ] Logs centralizados

## 👤 Autor

[Kevin Garzon]

## 📄 Licencia

MIT

---
Este proyecto es de código abierto y está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
