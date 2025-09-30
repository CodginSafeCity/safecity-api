import { ApiProperty } from '@nestjs/swagger';

export class ResetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}