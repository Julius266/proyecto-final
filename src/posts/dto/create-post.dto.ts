import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Consejos para el examen de programación #examen #programacion' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '/uploads/archivo.pdf', required: false })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiProperty({ example: ['examen', 'programacion'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}
