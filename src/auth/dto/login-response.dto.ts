import { ApiProperty } from '@nestjs/swagger';
import { UserProfileResponseDto } from './userProfile-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT de acceso',
  })
  access_token: string;

  @ApiProperty({ type: () => UserProfileResponseDto })
  user: UserProfileResponseDto;
}

export class LoginErrorDto {
  @ApiProperty({ example: 'Credenciales inválidas' })
  message: string;
}