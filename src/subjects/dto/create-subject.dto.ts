import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Programación Avanzada', description: 'Nombre de la materia' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Curso de programación orientada a objetos', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
