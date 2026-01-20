import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../student.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan.perez@universidad.edu', description: 'Email del usuario' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'student',
    enum: UserRole,
    required: false,
    description: 'Rol del usuario',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
