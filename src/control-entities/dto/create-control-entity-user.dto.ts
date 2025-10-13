import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateControlEntityUserDto extends CreateUserDto {
  @ApiProperty({ example: 'f3b2c9a8-7d14-4e2b-8a1c-93f4e2a1c7d5', description: 'Entidad de control asociada al usuario' })
  @IsString()
  @IsNotEmpty()
  controlEntityId!: string;
}
