import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class ControlEntityUserQueryFilterDto {
  @ApiPropertyOptional({ description: 'Límite de registros', example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset para paginación', example: 0 })
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiPropertyOptional({ description: 'Filtrar por ID de usuario', example: '1' })
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de entidad de control', example: '2' })
  @IsOptional()
  controlEntityId?: string;
}
