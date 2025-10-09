import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import { Expose, plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';

export class RoleDto {
  @ApiProperty({ example: 'uuid-role-123' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;
}

export class CityDto {
  @ApiProperty({ example: 'uuid-city-456' })
  id: string;

  @ApiProperty({ example: 'New York' })
  name: string;
}

export class UserDto {
  @ApiProperty({ example: 'uuid-user-789' })
  id!: string;

  @ApiProperty({ example: 'John' })
  name!: string;

  @ApiProperty({ example: 'Doe' })
  last_name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'https://avatar.url/image.png', required: false })
  avatar?: string;

  @ApiProperty({ type: RoleDto })
  role!: RoleDto;

  @ApiProperty({ type: CityDto, required: false })
  city?: CityDto;

  static fromEntity(entity: UserEntity): UserDto {
    return plainToInstance(UserDto, entity);
  }
}
