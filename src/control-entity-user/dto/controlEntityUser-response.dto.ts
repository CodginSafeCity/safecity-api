import { ApiProperty } from '@nestjs/swagger';
import { ControlEntityUserDto } from './control-entity-user.dto';

export class ControlEntityUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ type: [ControlEntityUserDto] })
  data: ControlEntityUserDto[];

  constructor(statusCode: number, message: string, data: ControlEntityUserDto[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
