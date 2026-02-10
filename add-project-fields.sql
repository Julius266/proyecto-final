-- Agregar nuevas columnas a la tabla projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS technologies jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS repository_url text,
ADD COLUMN IF NOT EXISTS demo_url text;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('technologies', 'repository_url', 'demo_url');
