# INSTRUCCIONES DE INSTALACIÓN Y USO

## 📋 Prerrequisitos

1. **Node.js** (versión 18 o superior)
2. **PostgreSQL** (versión 12 o superior)
3. **npm** o **yarn**

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar la base de datos

#### Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE students_platform;
```

#### Ejecutar el script SQL para crear las tablas:

Conectarse a la base de datos y ejecutar el script SQL que te proporcionaron:

```bash
psql -U postgres -d students_platform -f database.sql
```

O desde el cliente psql:

```sql
\c students_platform

-- Pega aquí el script SQL con todas las tablas
create table students (
  id bigint primary key generated always as identity,
  name text not null,
  email text unique not null,
  registration_date timestamp with time zone default now()
);

-- ... resto de las tablas
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña_aqui
DATABASE_NAME=students_platform
PORT=3000
```

### 4. Ejecutar la aplicación

#### Modo desarrollo (con hot-reload):

```bash
npm run start:dev
```

#### Modo producción:

```bash
npm run build
npm run start:prod
```

## 📚 Acceder a la documentación

Una vez que la aplicación esté corriendo, accede a:

**Swagger UI:** http://localhost:3000/api

Aquí podrás ver todos los endpoints disponibles y probarlos directamente desde el navegador.

## 🧪 Probar la API

### Opción 1: Usar Swagger UI
- Ve a http://localhost:3000/api
- Expande cualquier endpoint
- Haz clic en "Try it out"
- Ingresa los datos y ejecuta

### Opción 2: Usar cURL

```bash
# Crear un estudiante
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@uni.edu"}'

# Obtener todos los estudiantes
curl http://localhost:3000/students
```

### Opción 3: Usar Postman o Thunder Client (VS Code)
- Importa los ejemplos del archivo `API_EXAMPLES.md`

## 📁 Estructura del proyecto

```
src/
├── main.ts                 # Punto de entrada
├── app.module.ts           # Módulo principal
├── students/               # Módulo de estudiantes
│   ├── student.entity.ts   # Entidad TypeORM
│   ├── students.service.ts # Lógica de negocio
│   ├── students.controller.ts # Endpoints REST
│   ├── students.module.ts  # Configuración del módulo
│   └── dto/                # Data Transfer Objects
├── subjects/               # Materias
├── exams/                  # Exámenes
├── assignments/            # Tareas
├── projects/               # Proyectos
├── posts/                  # Publicaciones
├── comments/               # Comentarios
└── hashtags/               # Hashtags
```

## 🔍 Endpoints principales

### Estudiantes
- `POST /students` - Crear estudiante
- `GET /students` - Listar todos
- `GET /students/:id` - Obtener uno
- `PATCH /students/:id` - Actualizar
- `DELETE /students/:id` - Eliminar

### Publicaciones (con búsqueda)
- `GET /posts` - Todas las publicaciones
- `GET /posts?search=texto` - Buscar por contenido
- `GET /posts?hashtag=nombre` - Filtrar por hashtag
- `GET /posts?studentId=1` - Publicaciones de un estudiante

### Hashtags
- `GET /hashtags/popular` - Hashtags más usados
- `GET /hashtags/name/:nombre` - Buscar por nombre

## ⚙️ Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar proyecto
npm run build

# Producción
npm run start:prod

# Formatear código
npm run format

# Linting
npm run lint

# Tests
npm run test
```

## 🐛 Solución de problemas

### Error de conexión a la base de datos

Verifica que:
1. PostgreSQL esté corriendo
2. Las credenciales en `.env` sean correctas
3. La base de datos `students_platform` exista
4. Las tablas estén creadas

```bash
# Verificar si PostgreSQL está corriendo
# Windows:
Get-Service postgresql*

# Conectarse a PostgreSQL
psql -U postgres
```

### Puerto 3000 ya en uso

Cambia el puerto en el archivo `.env`:

```env
PORT=3001
```

### Error "Cannot find module"

Reinstala las dependencias:

```bash
rm -rf node_modules
npm install
```

## 📖 Documentación adicional

- **Swagger UI:** http://localhost:3000/api
- **Ejemplos de API:** Ver `API_EXAMPLES.md`
- **NestJS:** https://docs.nestjs.com
- **TypeORM:** https://typeorm.io

## 🎯 Funcionalidades implementadas

✅ CRUD completo para todas las entidades
✅ Relaciones entre tablas (Foreign Keys)
✅ Sistema de publicaciones con hashtags
✅ Comentarios en publicaciones
✅ Búsqueda por texto en publicaciones
✅ Filtros por hashtag
✅ Filtros por estudiante y materia
✅ Hashtags populares
✅ Validación de datos con class-validator
✅ Documentación automática con Swagger
✅ Manejo de errores (404, validación, etc.)

## 🚀 Próximos pasos

Para mejorar la aplicación puedes agregar:

1. **Autenticación y autorización** (JWT, Passport)
2. **Paginación** en los listados
3. **Upload de archivos** para las publicaciones
4. **WebSockets** para notificaciones en tiempo real
5. **Cache** con Redis
6. **Rate limiting**
7. **Tests unitarios y e2e**
8. **Docker** para facilitar el deployment

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs de la aplicación
2. Los logs de PostgreSQL
3. Que todas las tablas estén creadas correctamente
4. Que las variables de entorno estén bien configuradas
