import { ApiProperty } from '@nestjs/swagger';
import { ControlEntityUserDto } from './control-entity-user.dto';

export class FindControlEntityUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'ControlEntityUsers retrieved successfully' })
  message: string;

  @ApiProperty({ type: [ControlEntityUserDto] })
  data: ControlEntityUserDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}
