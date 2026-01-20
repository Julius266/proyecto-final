# Ejemplos de Uso de la API

## Estudiantes

### Crear estudiante
```bash
POST http://localhost:3000/students
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@universidad.edu"
}
```

### Obtener todos los estudiantes
```bash
GET http://localhost:3000/students
```

### Obtener estudiante por ID
```bash
GET http://localhost:3000/students/1
```

## Materias

### Crear materia
```bash
POST http://localhost:3000/subjects
Content-Type: application/json

{
  "name": "Programación Avanzada",
  "description": "Curso de programación orientada a objetos y patrones de diseño"
}
```

### Obtener todas las materias
```bash
GET http://localhost:3000/subjects
```

## Exámenes

### Crear examen
```bash
POST http://localhost:3000/exams
Content-Type: application/json

{
  "subjectId": 1,
  "studentId": 1,
  "date": "2026-02-15",
  "description": "Examen parcial - Capítulos 1 al 5"
}
```

### Obtener exámenes con filtros
```bash
# Todos los exámenes
GET http://localhost:3000/exams

# Exámenes de una materia específica
GET http://localhost:3000/exams?subjectId=1

# Exámenes de un estudiante específico
GET http://localhost:3000/exams?studentId=1
```

## Tareas

### Crear tarea
```bash
POST http://localhost:3000/assignments
Content-Type: application/json

{
  "subjectId": 1,
  "studentId": 1,
  "dueDate": "2026-02-20",
  "description": "Implementar árbol binario de búsqueda"
}
```

### Obtener tareas
```bash
GET http://localhost:3000/assignments?subjectId=1
```

## Proyectos

### Crear proyecto
```bash
POST http://localhost:3000/projects
Content-Type: application/json

{
  "subjectId": 1,
  "studentId": 1,
  "dueDate": "2026-03-15",
  "description": "Proyecto final: Sistema de gestión de inventario"
}
```

## Publicaciones (Posts)

### Crear publicación con hashtags
```bash
POST http://localhost:3000/posts
Content-Type: application/json

{
  "studentId": 1,
  "content": "Consejos para el examen de programación: repasar los patrones de diseño #examen #programacion #consejos",
  "hashtags": ["examen", "programacion", "consejos"]
}
```

### Buscar publicaciones
```bash
# Todas las publicaciones
GET http://localhost:3000/posts

# Buscar por texto
GET http://localhost:3000/posts?search=examen

# Buscar por hashtag
GET http://localhost:3000/posts?hashtag=programacion

# Publicaciones de un estudiante
GET http://localhost:3000/posts?studentId=1

# Combinación de filtros
GET http://localhost:3000/posts?search=consejos&hashtag=examen
```

## Comentarios

### Crear comentario
```bash
POST http://localhost:3000/comments
Content-Type: application/json

{
  "postId": 1,
  "studentId": 2,
  "content": "Muy útil, gracias por compartir!"
}
```

### Obtener comentarios de una publicación
```bash
GET http://localhost:3000/comments?postId=1
```

## Hashtags

### Obtener todos los hashtags
```bash
GET http://localhost:3000/hashtags
```

### Obtener hashtags más populares
```bash
GET http://localhost:3000/hashtags/popular?limit=10
```

### Buscar hashtag por nombre
```bash
GET http://localhost:3000/hashtags/name/programacion
```

### Obtener hashtag con sus publicaciones
```bash
GET http://localhost:3000/hashtags/1
```

## Ejemplos de actualización y eliminación

### Actualizar estudiante
```bash
PATCH http://localhost:3000/students/1
Content-Type: application/json

{
  "name": "Juan Carlos Pérez"
}
```

### Eliminar publicación
```bash
DELETE http://localhost:3000/posts/1
```

## Escenario de uso completo

1. **Registrar estudiantes:**
```json
POST /students
{ "name": "Ana García", "email": "ana.garcia@uni.edu" }
{ "name": "Pedro López", "email": "pedro.lopez@uni.edu" }
```

2. **Crear materias:**
```json
POST /subjects
{ "name": "Base de Datos", "description": "SQL y NoSQL" }
{ "name": "Algoritmos", "description": "Estructuras de datos" }
```

3. **Registrar examen:**
```json
POST /exams
{
  "subjectId": 1,
  "studentId": 1,
  "date": "2026-02-15",
  "description": "Examen de SQL y normalización"
}
```

4. **Crear publicación con consejos:**
```json
POST /posts
{
  "studentId": 1,
  "content": "Para el examen de BD repasen normalización hasta 3FN #basedatos #examen #tips",
  "hashtags": ["basedatos", "examen", "tips"]
}
```

5. **Comentar en la publicación:**
```json
POST /comments
{
  "postId": 1,
  "studentId": 2,
  "content": "Gracias! Muy útil"
}
```

6. **Buscar publicaciones sobre exámenes:**
```
GET /posts?hashtag=examen
```
