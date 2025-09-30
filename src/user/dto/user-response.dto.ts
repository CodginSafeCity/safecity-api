import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class CityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

//   @ApiProperty()
//   province: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  avatar?: string;

  @ApiProperty({ type: () => RoleResponseDto, nullable: true })
  role?: RoleResponseDto;

  @ApiProperty({ type: () => CityResponseDto, nullable: true })
  city?: CityResponseDto;
}