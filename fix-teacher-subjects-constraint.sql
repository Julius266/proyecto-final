-- Eliminar el constraint único anterior que solo permitía un docente por materia
ALTER TABLE "teacher_subjects" 
DROP CONSTRAINT IF EXISTS "UQ_270944526388fb4963450e8dcab";

-- Crear el nuevo constraint único que permite múltiples docentes por materia
-- pero solo una vez por docente
ALTER TABLE "teacher_subjects" 
ADD CONSTRAINT "UQ_teacher_curriculum_subject" 
UNIQUE ("teacher_id", "curriculum_subject_id");

-- Verificar que se creó correctamente
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'teacher_subjects';
