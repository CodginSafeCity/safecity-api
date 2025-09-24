import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
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
import { CityEntity } from 'src/locations/city.entity';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class IncidentService {
    constructor(
        @InjectRepository(IncidentEntity)
        private readonly incidentRepository: EntityRepository<IncidentEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @InjectRepository(IncidentCategoryEntity)
        private readonly categoryRepository: EntityRepository<IncidentCategoryEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
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

        await this.incidentRepository.getEntityManager().persistAndFlush(incident);
        return incident;
    }

    @HandleError('Error retrieving incidents', {
        errorException: InternalServerErrorException,
    })
    async find(filter: FilterQuery<IncidentEntity> = {}): Promise<IncidentEntity[]> {
        return this.incidentRepository.find(filter, {
            populate: ['user', 'category', 'city'],
        });
    }

    @HandleError('Error retrieving incident by id', { throwError: true })
    async findById(id: string): Promise<IncidentEntity> {
        const incident = await this.incidentRepository.findOne(
            { id },
            { populate: ['user', 'category', 'city'] },
        );
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
}
