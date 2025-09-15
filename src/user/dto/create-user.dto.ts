import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @IsUUID()
  @IsOptional()
  cityId?: string;
}
