import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ 
    example: 'currentPassword123', 
    description: 'Contraseña actual del usuario' 
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ 
    example: 'newPassword456', 
    description: 'Nueva contraseña (mínimo 6 caracteres)' 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
