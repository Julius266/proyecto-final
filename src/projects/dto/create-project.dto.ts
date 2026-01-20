import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 1, description: 'ID de la materia' })
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2026-03-01', description: 'Fecha de entrega' })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 'Proyecto final de la materia', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
