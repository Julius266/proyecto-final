# 📦 Dependencias que faltan por instalar en el Backend

Para que todas las funcionalidades nuevas funcionen correctamente, necesitas instalar estas dependencias en el backend:

## Instalación

Ejecuta estos comandos en la carpeta `proyecto-final`:

```bash
# Dependencias para upload de archivos
npm install @nestjs/platform-express multer

# Tipos de TypeScript para Multer
npm install -D @types/multer

# Servir archivos estáticos
npm install @nestjs/serve-static
```

## Comando completo:

```bash
cd proyecto-final
npm install @nestjs/platform-express multer @nestjs/serve-static
npm install -D @types/multer
```

## Crear carpeta de uploads:

```bash
mkdir uploads
```

## Actualizar .gitignore:

Agrega estas líneas a tu archivo `.gitignore`:

```
uploads/
*.jpg
*.jpeg
*.png
*.gif
*.webp
```

## Verificar instalación:

Después de instalar, tu `package.json` debe incluir:

```json
{
  "dependencies": {
    "@nestjs/platform-express": "^10.x.x",
    "@nestjs/serve-static": "^4.x.x",
    "multer": "^1.4.x"
  },
  "devDependencies": {
    "@types/multer": "^1.4.x"
  }
}
```

## Iniciar el servidor:

```bash
npm run start:dev
```

Si hay errores de compilación relacionados con las nuevas funcionalidades, estas dependencias los resolverán.
