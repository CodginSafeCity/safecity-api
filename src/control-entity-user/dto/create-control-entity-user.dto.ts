import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateControlEntityUserDto {
  @ApiProperty({
    description: 'ID del usuario que se va a asociar',
    example: 'f8b9c998-7d3e-4b0a-a517-1d05d7f49d1a',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID de la entidad de control a la que se asocia el usuario',
    example: 'cdd2d5fb-45f1-4e0b-98f0-7d66e9280e6e',
  })
  @IsUUID()
  @IsNotEmpty()
  controlEntityId: string;
}
