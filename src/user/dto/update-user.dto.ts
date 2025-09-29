import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'Nombre del usuario', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario', required: false })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Correo electrónico del usuario', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', description: 'URL del avatar', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'ID del rol asignado', required: false })
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiProperty({ example: 'a5c6d5e4-91c7-4d3e-9c7f-bc2a6e9e2a11', description: 'ID de la ciudad asignada', required: false })
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
