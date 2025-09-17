import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Correo electrónico del usuario que solicita el cambio de contraseña',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}