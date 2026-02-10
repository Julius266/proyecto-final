import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbzwygjr0',
      api_key: process.env.CLOUDINARY_API_KEY || '814387926114569',
      api_secret: process.env.CLOUDINARY_API_SECRET || '3nscUMjCw0daOmDbHn2C9ek8FpQ',
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'trazio/images',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
              { width: 1920, height: 1920, crop: 'limit' }, // Limita el tamaño máximo
              { quality: 'auto:good' }, // Optimización automática
            ],
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(new BadRequestException(`Error al subir imagen: ${error.message}`));
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'trazio/videos',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
            transformation: [
              { width: 1920, height: 1080, crop: 'limit' }, // Limita el tamaño máximo
              { quality: 'auto' },
            ],
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(new BadRequestException(`Error al subir video: ${error.message}`));
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }

  async uploadDocument(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'trazio/documents',
            resource_type: 'raw',
            allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(new BadRequestException(`Error al subir documento: ${error.message}`));
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }

  async uploadFile(file: Express.Multer.File, type: 'image' | 'video' | 'document'): Promise<UploadApiResponse> {
    if (type === 'image') {
      return this.uploadImage(file);
    } else if (type === 'video') {
      return this.uploadVideo(file);
    } else {
      return this.uploadDocument(file);
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`Error al eliminar archivo: ${error.message}`);
    }
  }

  // Método auxiliar para obtener la URL optimizada
  getOptimizedUrl(publicId: string, options?: any): string {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    });
  }
}
