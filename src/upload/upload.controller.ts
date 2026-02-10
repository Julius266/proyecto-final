import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir una imagen a Cloudinary (requiere autenticación)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpg, jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL de la imagen en Cloudinary' },
        publicId: { type: 'string', description: 'ID público de la imagen para futuras referencias' },
        secureUrl: { type: 'string', description: 'URL segura (HTTPS)' },
        format: { type: 'string', description: 'Formato de la imagen' },
        width: { type: 'number', description: 'Ancho de la imagen' },
        height: { type: 'number', description: 'Alto de la imagen' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o falta el archivo' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar que sea una imagen
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)');
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 10MB');
    }

    const result = await this.cloudinaryService.uploadImage(file);

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }

  @Post('video')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir un video a Cloudinary (requiere autenticación)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de video (mp4, mov, avi, wmv, flv, webm)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video subido exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL del video en Cloudinary' },
        publicId: { type: 'string', description: 'ID público del video' },
        secureUrl: { type: 'string', description: 'URL segura (HTTPS)' },
        format: { type: 'string', description: 'Formato del video' },
        duration: { type: 'number', description: 'Duración en segundos' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o falta el archivo' })
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar que sea un video
    if (!file.mimetype.match(/\/(mp4|quicktime|x-msvideo|x-ms-wmv|x-flv|webm|avi|mov)$/)) {
      throw new BadRequestException('Solo se permiten archivos de video (mp4, mov, avi, wmv, flv, webm)');
    }

    // Validar tamaño (100MB máximo)
    if (file.size > 100 * 1024 * 1024) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 100MB');
    }

    const result = await this.cloudinaryService.uploadVideo(file);

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }

  @Post('document')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir un documento a Cloudinary (requiere autenticación)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de documento (pdf, doc, docx, xls, xlsx, ppt, pptx, txt)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Documento subido exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL del documento en Cloudinary' },
        publicId: { type: 'string', description: 'ID público del documento' },
        secureUrl: { type: 'string', description: 'URL segura (HTTPS)' },
        format: { type: 'string', description: 'Formato del documento' },
        originalFilename: { type: 'string', description: 'Nombre original del archivo' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o falta el archivo' })
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar que sea un documento permitido
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten archivos de documento (pdf, doc, docx, xls, xlsx, ppt, pptx, txt)');
    }

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 50MB');
    }

    const result = await this.cloudinaryService.uploadDocument(file);

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      originalFilename: file.originalname,
      bytes: result.bytes,
    };
  }

  @Delete('file')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un archivo de Cloudinary (requiere autenticación)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        publicId: {
          type: 'string',
          description: 'ID público del archivo a eliminar',
          example: 'trazio/images/abc123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el archivo' })
  async deleteFile(@Body('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Se requiere el publicId del archivo');
    }

    const result = await this.cloudinaryService.deleteFile(publicId);
    
    return {
      message: 'Archivo eliminado exitosamente',
      result,
    };
  }
}
