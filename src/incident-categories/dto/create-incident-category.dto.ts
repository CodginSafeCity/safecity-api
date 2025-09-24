import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncidentCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
