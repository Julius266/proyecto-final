# Students Platform Backend

Backend API para plataforma de estudiantes universitarios desarrollado con NestJS y PostgreSQL.

## Características

- CRUD completo para estudiantes, materias, exámenes, tareas y proyectos
- Sistema de publicaciones con hashtags
- Comentarios en publicaciones
- Sistema de búsqueda con filtros
- API RESTful documentada con Swagger

## Requisitos

- Node.js >= 18
- PostgreSQL >= 12
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` con tus credenciales de base de datos

5. Crear la base de datos en PostgreSQL y ejecutar el script SQL proporcionado

## Ejecutar

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Documentación API

Una vez iniciado el servidor, accede a: http://localhost:3000/api

## Endpoints Principales

- `/students` - Gestión de estudiantes
- `/subjects` - Gestión de materias
- `/exams` - Gestión de exámenes
- `/assignments` - Gestión de tareas
- `/projects` - Gestión de proyectos
- `/posts` - Gestión de publicaciones
- `/comments` - Gestión de comentarios
- `/hashtags` - Gestión de hashtags
