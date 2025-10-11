import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
    Logger,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { HandleError } from 'src/common/decorators/handle-error.decorator';
import { IncidentEntity } from './incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from 'src/incident-categories/incident-category.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { IncidentQueryFilterDto } from './dto/incident-find-options.dto';
import { CityEntity } from 'src/locations/city.entity';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class IncidentService {
    private readonly logger = new Logger(IncidentService.name)
    constructor(
        @InjectRepository(IncidentEntity)
        private readonly incidentRepository: EntityRepository<IncidentEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @InjectRepository(IncidentCategoryEntity)
        private readonly categoryRepository: EntityRepository<IncidentCategoryEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
        @InjectRepository(AvailabilityZoneEntity)
        private readonly availabilityzoneRepository: EntityRepository<AvailabilityZoneEntity>,
        @InjectRepository(ControlEntity)
        private readonly controlEntityRepo: EntityRepository<ControlEntity>,
        @InjectRepository(ControlEntityUser)
        private readonly controlEntityUserRepo: EntityRepository<ControlEntityUser>,

    ) { }

    @HandleError('Error creating incident', {
        errorException: InternalServerErrorException,
    })
    async create(dto: CreateIncidentDto): Promise<IncidentEntity> {
        const user = await this.userRepository.findOneOrFail({ id: dto.userId });
        const category = await this.categoryRepository.findOneOrFail({ id: dto.categoryId });
        const city = await this.cityRepository.findOneOrFail({ id: dto.cityId });

        const incident = new IncidentEntity();
        wrap(incident).assign({
            user,
            category,
            city,
            description: dto.description,
            reported_at: dto.reported_at,
            verified_at: dto.verified_at,
            location: dto.location,
        });

        const zone = await this.findZoneByLocation(dto.location);
        if (!zone) {
            throw new NotFoundException('No availability zone found for this location');
        }

        const controlEntity = await this.controlEntityRepo.findOne({ availabilityZones: zone.id });
        if (!controlEntity) {
            throw new NotFoundException('No control entity associated with this zone');
        }

        const controlUsers = await this.controlEntityUserRepo.find(
            { controlEntity },
            { populate: ['user'] },
        );

        if (controlUsers.length === 0) {
            throw new NotFoundException('No users associated with this control entity');
        }

        const assignedUser = controlUsers[0].user;

        incident.assigned_to = assignedUser;

        await this.incidentRepository.getEntityManager().persistAndFlush(incident);
        return incident;
    }

    async find(query: IncidentQueryFilterDto) {
        const filter: FilterQuery<IncidentEntity> = {};

        if (query.filter?.description) {
            filter.description = { $like: `%${query.filter.description}%` };
        }

        const [result, total] = await this.incidentRepository.findAndCount(filter, {
            limit: query.pagination?.limit ?? 10,
            offset: query.pagination?.offset ?? 0,
        });

        return { data: result, total };
    }

    async findById(id: string) {
        const incident = await this.incidentRepository.findOne({ id });
        if (!incident) throw new NotFoundException(`Incident with id ${id} not found`);
        return incident;
    }

    @HandleError('Error updating incident', { throwError: true })
    async update(id: string, dto: UpdateIncidentDto): Promise<IncidentEntity> {
        return this.incidentRepository.getEntityManager().transactional(async () => {
            const incident = await this.findById(id);

            if (dto.userId) {
                incident.user = await this.userRepository.findOneOrFail({ id: dto.userId });
            }
            if (dto.categoryId) {
                incident.category = await this.categoryRepository.findOneOrFail({ id: dto.categoryId });
            }
            if (dto.cityId) {
                incident.city = await this.cityRepository.findOneOrFail({ id: dto.cityId });
            }

            this.incidentRepository.assign(incident, {
                description: dto.description ?? incident.description,
                reported_at: dto.reported_at ?? incident.reported_at,
                verified_at: dto.verified_at ?? incident.verified_at,
                location: dto.location ?? incident.location,
            });

            await this.incidentRepository.getEntityManager().persistAndFlush(incident);
            return incident;
        });
    }

    @HandleError('Error deleting incident', { throwError: true })
    async delete(id: string): Promise<IncidentEntity> {
        const incident = await this.findById(id);
        await this.incidentRepository.getEntityManager().removeAndFlush(incident);
        return incident;
    }

    async findByUser(userId: string): Promise<IncidentEntity[]> {
        const incidents = await this.incidentRepository.find(
            { user: userId },
            { populate: ['user', 'category', 'city'] },
        );
        if (!incidents.length) {
            throw new NotFoundException(`No incidents found for user with id ${userId}`);
        }
        return incidents;
    }

    private async findZoneByLocation(location: any) {
        const em = this.availabilityzoneRepository.getEntityManager();
        const qb = em.createQueryBuilder(AvailabilityZoneEntity, 'z');

        const point = JSON.stringify(location);

        return await qb
            .where('ST_Contains(z.area, ST_SetSRID(ST_GeomFromGeoJSON(?), 4326))', [point])
            .limit(1)
            .getSingleResult();
    }
}
