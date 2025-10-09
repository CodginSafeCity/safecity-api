import { ApiProperty } from '@nestjs/swagger';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

export class ControlEntityDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    address!: string;

    @ApiProperty()
    phone!: string;

    @ApiProperty({ type: () => [AvailableZoneInfoDto] })
    AvailableZones!: AvailableZoneInfoDto[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;


    static fromEntity(entity: ControlEntity): ControlEntityDto {
        const dto = new ControlEntityDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.address = entity.address;
        dto.phone = entity.phone;
        dto.AvailableZones = entity.availabilityZones.map(z =>
            AvailableZoneInfoDto.fromEntity(z)
        );
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
    }
}

export class AvailableZoneInfoDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ type: () => AvailableZoneInfoDto })
    availabilityZones!: AvailableZoneInfoDto;

    static fromEntity(availabilityZone: AvailabilityZoneEntity): AvailableZoneInfoDto {
        const dto = new AvailableZoneInfoDto();
        dto.id = availabilityZone.id;
        dto.name = availabilityZone.name;
        return dto;
    }
}