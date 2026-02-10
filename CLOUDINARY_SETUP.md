# Configuración de Cloudinary

Este documento explica cómo está configurado Cloudinary en el proyecto para subir imágenes y videos.

## 🔑 Credenciales

Las credenciales de Cloudinary están configuradas en el archivo `.env`:

```env
CLOUDINARY_CLOUD_NAME=dbzwygjr0
CLOUDINARY_API_KEY=814387926114569
CLOUDINARY_API_SECRET=3nscUMjCw0daOmDbHn2C9ek8FpQ
```

## 📁 Estructura del Backend

### Servicio de Cloudinary (`src/upload/cloudinary.service.ts`)

Proporciona métodos para:
- ✅ Subir imágenes (hasta 10MB)
- ✅ Subir videos (hasta 100MB)
- ✅ Eliminar archivos
- ✅ Obtener URLs optimizadas

### Controlador (`src/upload/upload.controller.ts`)

Endpoints disponibles:

#### 1. Subir Imagen
```
POST /upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: archivo de imagen (jpg, jpeg, png, gif, webp)

Response:
{
  "url": "http://res.cloudinary.com/...",
  "secureUrl": "https://res.cloudinary.com/...",
  "publicId": "trazio/images/xxx",
  "format": "jpg",
  "width": 1920,
  "height": 1080,
  "bytes": 123456
}
```

#### 2. Subir Video
```
POST /upload/video
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: archivo de video (mp4, mov, avi, wmv, flv, webm)

Response:
{
  "url": "http://res.cloudinary.com/...",
  "secureUrl": "https://res.cloudinary.com/...",
  "publicId": "trazio/videos/xxx",
  "format": "mp4",
  "duration": 45.5,
  "width": 1920,
  "height": 1080,
  "bytes": 5000000
}
```

#### 3. Eliminar Archivo
```
DELETE /upload/file
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "publicId": "trazio/images/xxx"
}

Response:
{
  "message": "Archivo eliminado exitosamente",
  "result": { ... }
}
```

## 🎨 Frontend

### Servicio (`src/services/upload.service.ts`)

Métodos disponibles:
- `uploadImage(file, onProgress?)` - Sube una imagen
- `uploadVideo(file, onProgress?)` - Sube un video
- `deleteFile(publicId)` - Elimina un archivo
- `validateImageFile(file)` - Valida una imagen
- `validateVideoFile(file)` - Valida un video

### Componente (`src/components/FileUploader.tsx`)

Componente reutilizable con las siguientes características:
- ✅ Drag & drop (opcional)
- ✅ Preview de imágenes
- ✅ Barra de progreso
- ✅ Validación de archivos
- ✅ Manejo de errores
- ✅ UI moderna y responsiva

#### Uso básico:

```tsx
import { FileUploader } from './components/FileUploader';

function MiComponente() {
  const handleUploadComplete = (result) => {
    console.log('URL de la imagen:', result.secureUrl);
    // Guarda result.secureUrl en tu estado o envíalo al backend
  };

  return (
    <FileUploader
      type="image"  // "image" | "video" | "both"
      onUploadComplete={handleUploadComplete}
      onError={(error) => console.error(error)}
    />
  );
}
```

## 📦 Organización de archivos en Cloudinary

Los archivos se organizan automáticamente en carpetas:
- **Imágenes**: `trazio/images/`
- **Videos**: `trazio/videos/`

## 🔒 Seguridad

- ✅ Todas las operaciones requieren autenticación JWT
- ✅ Validación de tipos de archivo en frontend y backend
- ✅ Límites de tamaño configurados
- ✅ Las credenciales están en variables de entorno

## 🚀 Optimizaciones automáticas

El servicio aplica automáticamente:
- Redimensionamiento inteligente (mantiene proporción)
- Compresión con calidad automática
- Conversión a formatos modernos (cuando es posible)
- URLs optimizadas para CDN

## 📝 Ejemplos de uso

### Subir una imagen desde un formulario

```tsx
import { useState } from 'react';
import { FileUploader } from './components/FileUploader';

function CreatePost() {
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (result) => {
    setImageUrl(result.secureUrl);
    // Aquí puedes enviar la URL a tu backend para guardarla
  };

  return (
    <form>
      <FileUploader
        type="image"
        onUploadComplete={handleImageUpload}
        onError={(error) => alert(error)}
      />
      {imageUrl && <img src={imageUrl} alt="Preview" />}
    </form>
  );
}
```

### Subir múltiples archivos

```tsx
const [urls, setUrls] = useState<string[]>([]);

const handleUpload = (result) => {
  setUrls([...urls, result.secureUrl]);
};

return (
  <div>
    <FileUploader
      type="both"
      onUploadComplete={handleUpload}
      multiple={true}
    />
    {urls.map((url, i) => (
      <div key={i}>{url}</div>
    ))}
  </div>
);
```

## 🔧 Configuración avanzada

Si necesitas personalizar las transformaciones, edita `src/upload/cloudinary.service.ts`:

```typescript
transformation: [
  { width: 2000, height: 2000, crop: 'limit' },
  { quality: 'auto:best' },
  { effect: 'sharpen' }
]
```

## 📊 Monitoreo

Puedes ver todas tus subidas en el dashboard de Cloudinary:
https://cloudinary.com/console/dbzwygjr0/media_library

## 🆘 Troubleshooting

### Error: "No se proporcionó ningún archivo"
- Verifica que el campo del formulario se llame `file`
- Asegúrate de usar `Content-Type: multipart/form-data`

### Error: "401 Unauthorized"
- Verifica que el token JWT sea válido
- Confirma que el header Authorization esté presente

### Error: "Archivo demasiado grande"
- Imágenes: máximo 10MB
- Videos: máximo 100MB
- Ajusta los límites en `cloudinary.service.ts` si es necesario

### Error de credenciales
- Verifica que las variables de entorno estén correctamente configuradas
- Confirma que el archivo `.env` esté en la raíz del proyecto backend
