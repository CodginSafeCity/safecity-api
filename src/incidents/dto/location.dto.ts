import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsNotEmpty,
} from 'class-validator';

@ValidatorConstraint({ name: 'coordinatesRange', async: false })
class CoordinatesRangeConstraint implements ValidatorConstraintInterface {
  validate(coordinates: any, args: ValidationArguments) {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
    const [lon, lat] = coordinates;
    if (typeof lon !== 'number' || typeof lat !== 'number') return false;
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
  }

  defaultMessage(args: ValidationArguments) {
    return 'coordinates must be [longitude, latitude] with longitude in [-180,180] and latitude in [-90,90]';
  }
}

export class LocationDto {
  @ApiProperty({
    example: 'Point',
    description: 'GeoJSON type. Must be "Point"',
  })
  @IsIn(['Point'])
  @IsNotEmpty()
  type!: 'Point';

  @ApiProperty({
    example: [-74.08175, 4.60971],
    description: 'Coordinates in [longitude, latitude] order',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Validate(CoordinatesRangeConstraint)
  coordinates!: [number, number];
}
