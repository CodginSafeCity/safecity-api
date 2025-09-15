import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsUUID()
  @IsOptional()
  roleId?: string;

  @IsUUID()
  @IsOptional()
  cityId?: string;

  static toEntity(dto: UpdateUserDto, entity: UserEntity): UserEntity {
    if (dto.name) entity.name = dto.name;
    if (dto.last_name) entity.last_name = dto.last_name;
    if (dto.email) entity.email = dto.email;
    if (dto.password) entity.password = dto.password;
    if (dto.avatar) entity.avatar = dto.avatar;

    if (dto.roleId) entity.role = dto.roleId as unknown as RoleEntity;
    if (dto.cityId) entity.city = dto.cityId as unknown as CityEntity;

    return entity;
  }
}
