import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { AvailabilityZoneEntity } from './availability-zone.entity';
import { CreateAvailabilityZoneDto } from './dto/create-availability-zone.dto';
import { UpdateAvailabilityZoneDto } from './dto/update-availability-zone.dto';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { AvailabilityZoneQueryFilterDto } from './dto/availability-zone-find-options.dto';

@Injectable()
export class AvailabilityZonesService {
    constructor(
        @InjectRepository(AvailabilityZoneEntity)
        private readonly repo: EntityRepository<AvailabilityZoneEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepo: EntityRepository<CityEntity>,
        @InjectRepository(ControlEntity)
        private readonly controlRepo: EntityRepository<ControlEntity>,
        @Inject(EntityManager)
        private readonly em: EntityManager,
    ) { }


    async create(dto: CreateAvailabilityZoneDto): Promise<AvailabilityZoneEntity> {
        const city = await this.cityRepo.findOne(dto.cityId);
        if (!city) throw new NotFoundException('City not found');

        const controlEntity = await this.controlRepo.findOne(dto.controlEntityId);
        if (!controlEntity) throw new NotFoundException('Control Entity not found');

        const zone = new AvailabilityZoneEntity(dto.name, city, controlEntity, dto.area);
        await this.em.persistAndFlush(zone);

        return zone;
    }

    async find(filter: AvailabilityZoneQueryFilterDto) {
        const [data, total] = await this.repo.findAndCount(
            {},
            {
                limit: filter.limit ?? 10,
                offset: filter.offset ?? 0,
                populate: ['city', 'controlEntity'],
                orderBy: { createdAt: 'DESC' },
            },
        );
        return { data, total };
    }

    async findById(id: string) {
        const zone = await this.repo.findOne(id, { populate: ['city', 'controlEntity'] });
        if (!zone) throw new NotFoundException('Availability Zone not found');
        return zone;
    }

    async update(id: string, dto: UpdateAvailabilityZoneDto) {
        const zone = await this.findById(id);

        if (dto.name) zone.name = dto.name;
        if (dto.area) zone.area = dto.area;

        if (dto.cityId) {
            const city = await this.cityRepo.findOne(dto.cityId);
            if (!city) throw new NotFoundException('City not found');
            zone.city = city;
        }

        if (dto.controlEntityId) {
            const controlEntity = await this.controlRepo.findOne(dto.controlEntityId);
            if (!controlEntity) throw new NotFoundException('Control Entity not found');
            zone.controlEntity = controlEntity;
        }

        await this.em.flush();
        return zone;
    }

    async delete(id: string) {
        const zone = await this.findById(id);
        await this.em.removeAndFlush(zone);
        return zone;
    }

    async findZonesByControlEntityId(controlEntityId: string): Promise<AvailabilityZoneEntity[]> {
        const zones = await this.repo.find(
            { controlEntity: controlEntityId },
            { populate: ['city', 'controlEntity'], orderBy: { createdAt: 'DESC' } },
        );

        if (!zones.length) {
            throw new NotFoundException('No se encontraron zonas asociadas a la entidad de control');
        }

        return zones;
    }
}
