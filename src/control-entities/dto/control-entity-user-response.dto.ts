import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/user.entity';

export class ControlEntityUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  last_name!: string;

  static fromEntity(user: UserEntity): ControlEntityUserResponseDto {
    const dto = new ControlEntityUserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.last_name = user.last_name;
    return dto;
  }
}
