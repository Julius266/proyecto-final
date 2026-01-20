import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-student.dto';

// No permitimos actualizar password aquí (se hará en un endpoint separado)
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {}
