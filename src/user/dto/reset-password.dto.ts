import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Correo electrónico asociado a la cuenta',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de reseteo de contraseña enviado al correo',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Nueva contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
