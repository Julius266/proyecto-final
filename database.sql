-- Script SQL para crear la base de datos students_platform
-- Ejecutar este script después de crear la base de datos

-- Tabla de usuarios (antes students)
create table users (
  id bigint primary key generated always as identity,
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'student',
  registration_date timestamp with time zone default now(),
  constraint role_check check (role in ('student', 'admin'))
);

-- Tabla de materias
create table subjects (
  id bigint primary key generated always as identity,
  name text not null,
  description text
);

-- Tabla de exámenes
create table exams (
  id bigint primary key generated always as identity,
  subject_id bigint references subjects (id) on delete cascade,
  user_id bigint references users (id) on delete cascade,
  date date not null,
  description text
);

-- Tabla de tareas
create table assignments (
  id bigint primary key generated always as identity,
  subject_id bigint references subjects (id) on delete cascade,
  user_id bigint references users (id) on delete cascade,
  due_date date not null,
  description text
);

-- Tabla de proyectos
create table projects (
  id bigint primary key generated always as identity,
  subject_id bigint references subjects (id) on delete cascade,
  user_id bigint references users (id) on delete cascade,
  due_date date not null,
  description text
);

-- Tabla de publicaciones
create table posts (
  id bigint primary key generated always as identity,
  user_id bigint references users (id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  file_path text
);

-- Tabla de hashtags
create table hashtags (
  id bigint primary key generated always as identity,
  name text unique not null
);

-- Tabla intermedia para relación muchos a muchos entre posts y hashtags
create table post_hashtags (
  post_id bigint references posts (id) on delete cascade,
  hashtag_id bigint references hashtags (id) on delete cascade,
  primary key (post_id, hashtag_id)
);

-- Tabla de comentarios
create table comments (
  id bigint primary key generated always as identity,
  post_id bigint references posts (id) on delete cascade,
  user_id bigint references users (id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Índices para mejorar el rendimiento
create index idx_exams_subject on exams(subject_id);
create index idx_exams_user on exams(user_id);
create index idx_exams_date on exams(date);

create index idx_assignments_subject on assignments(subject_id);
create index idx_assignments_user on assignments(user_id);
create index idx_assignments_due_date on assignments(due_date);

create index idx_projects_subject on projects(subject_id);
create index idx_projects_user on projects(user_id);
create index idx_projects_due_date on projects(due_date);

create index idx_posts_user on posts(user_id);
create index idx_posts_created_at on posts(created_at);

create index idx_comments_post on comments(post_id);
create index idx_comments_user on comments(user_id);
create index idx_comments_created_at on comments(created_at);

create index idx_hashtags_name on hashtags(name);

-- Datos de ejemplo (opcional - comentar si no se desean)

-- Insertar usuarios de ejemplo (contraseñas hasheadas con bcrypt para 'password123')
insert into users (name, email, password, role) values
  ('Admin Sistema', 'admin@universidad.edu', '$2b$10$rFq9YzBQvvKvH.MxqJ5rj.5jY6x7qYnRY5YxqYn5Y5YxqYn5Y5Yxq', 'admin'),
  ('Juan Pérez', 'juan.perez@universidad.edu', '$2b$10$rFq9YzBQvvKvH.MxqJ5rj.5jY6x7qYnRY5YxqYn5Y5YxqYn5Y5Yxq', 'student'),
  ('María García', 'maria.garcia@universidad.edu', '$2b$10$rFq9YzBQvvKvH.MxqJ5rj.5jY6x7qYnRY5YxqYn5Y5YxqYn5Y5Yxq', 'student'),
  ('Pedro López', 'pedro.lopez@universidad.edu', '$2b$10$rFq9YzBQvvKvH.MxqJ5rj.5jY6x7qYnRY5YxqYn5Y5YxqYn5Y5Yxq', 'student'),
  ('Ana Martínez', 'ana.martinez@universidad.edu', '$2b$10$rFq9YzBQvvKvH.MxqJ5rj.5jY6x7qYnRY5YxqYn5Y5YxqYn5Y5Yxq', 'student');

-- Insertar materias de ejemplo
insert into subjects (name, description) values
  ('Programación Avanzada', 'Curso de programación orientada a objetos y patrones de diseño'),
  ('Base de Datos', 'SQL, NoSQL y optimización de consultas'),
  ('Algoritmos y Estructuras de Datos', 'Análisis de complejidad y estructuras fundamentales'),
  ('Desarrollo Web', 'Frontend y Backend con tecnologías modernas');

-- Insertar exámenes de ejemplouser_id, date, description) values
  (1, 2, '2026-02-15', 'Examen parcial - Patrones de diseño'),
  (2, 2, '2026-02-20', 'Examen de SQL y normalización'),
  (1, 3, '2026-02-15', 'Examen parcial - Patrones de diseño'),
  (3, 4, '2026-02-25', 'Examen de complejidad algorítmica');

-- Insertar tareas de ejemplo
insert into assignments (subject_id, user_id, due_date, description) values
  (1, 2, '2026-02-10', 'Implementar patrón Singleton y Factory'),
  (2, 3, '2026-02-12', 'Normalizar base de datos hasta 3FN'),
  (3, 4, '2026-02-18', 'Implementar árbol AVL'),
  (4, 5, '2026-02-22', 'Crear API REST con autenticación');

-- Insertar proyectos de ejemplo
insert into projects (subject_id, user_id, due_date, description) values
  (1, 2, '2026-03-15', 'Sistema de gestión de biblioteca usando patrones de diseño'),
  (2, 3, '2026-03-20', 'Diseño e implementación de base de datos para e-commerce'),
  (4, 4, '2026-03-25', 'Aplicación web fullstack de red social estudiantil');

-- Insertar publicaciones de ejemplo
insert into posts (user_id, content) values
  (2, 'Consejos para el examen de programación: repasen los patrones Singleton, Factory y Observer. Son los más importantes!'),
  (3, 'Alguien tiene apuntes sobre normalización de bases de datos? Especialmente BCNF'),
  (4, 'Compartiendo mi implementación de árbol AVL en GitHub. Link en bio!'),
  (2, 'Compartiendo mi implementación de árbol AVL en GitHub. Link en bio!'),
  (1, 'Recordatorio: mañana es la entrega del proyecto de patrones de diseño. No olviden la documentación!');

-- Insertar hashtags
insert into hashtags (name) values
  ('examen'),
  ('programacion'),
  ('basedatos'),
  ('algoritmos'),
  ('proyectofinal'),
  ('tips'),
  ('ayuda'),
  ('recursosgratuitos');

-- Relacionar posts con hashtags
insert into post_hashtags (post_id, hashtag_id) values
  (1, 1), -- examen
  (1, 2), -- programacion
  (1, 6), -- tips
  (2, 3), -- basedatos
  (2, 7), -- ayuda
  (3, 4), -- algoritmos
  (3, 8), -- recursosgratuitos
  (4, 2), -- programacion
  (4, 5); -- proyectofinal

-- Insertar comentarios de ejemplo
insert into comments (post_id, user_id, content) values
  (1, 3, 'Muy útil, gracias por compartir!'),
  (1, 4, 'También les recomiendo el patrón Strategy'),
  (2, 2, 'Tengo unos apuntes, te los paso mañana'),
  (3, 5, 'Excelente implementación!'),
  (4, 3, 'Ya está lista! Gracias por el recordatorio');

-- Verificar que todo se insertó correctamente
select 'Usuarios: ' || count(*) from users;
select 'Materias: ' || count(*) from subjects;
select 'Exámenes: ' || count(*) from exams;
select 'Tareas: ' || count(*) from assignments;
select 'Proyectos: ' || count(*) from projects;
select 'Publicaciones: ' || count(*) from posts;
select 'Hashtags: ' || count(*) from hashtags;
select 'Comentarios: ' || count(*) from comments;
