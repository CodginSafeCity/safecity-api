import { ApiProperty } from '@nestjs/swagger';

export class ForgotResponseDto {
  @ApiProperty({ example: 'Se ha enviado un correo con instrucciones' })
  message: string;

  @ApiProperty({
    example:
      '21fb33d2b09da0692e51e9f0faef4d4c43548bd8bfb481434656f413a65f4746',
  })
  token: string;
}