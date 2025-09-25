import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', description: 'URL del avatar', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'ID del rol asignado' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @ApiProperty({ example: 'a5c6d5e4-91c7-4d3e-9c7f-bc2a6e9e2a11', description: 'ID de la ciudad asignada', required: false })
  @IsUUID()
  @IsOptional()
  cityId?: string;
}
