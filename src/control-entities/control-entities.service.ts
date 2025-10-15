import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateControlEntityDto } from './dto/create-control-entity.dto';
import { wrap } from '@mikro-orm/core';
import { IncidentEntity } from 'src/incidents/incident.entity';
import { raw } from '@mikro-orm/knex';

@Injectable()
export class ControlEntityService {
    constructor(
        @InjectRepository(ControlEntityUser)
        private readonly controlEntityUserRepository: EntityRepository<ControlEntityUser>,

        @InjectRepository(AvailabilityZoneEntity)
        private readonly repo: EntityRepository<AvailabilityZoneEntity>,

        @InjectRepository(CityEntity)
        private readonly cityRepo: EntityRepository<CityEntity>,

        @InjectRepository(ControlEntity)
        private readonly controlRepo: EntityRepository<ControlEntity>,

        @InjectRepository(IncidentEntity)
        private readonly incidentRepository: EntityRepository<IncidentEntity>,

        @Inject(EntityManager)
        private readonly em: EntityManager,
    ) { }

    async findUsersByControlEntityId(id: string): Promise<UserEntity[]> {
        const controlEntityUsers = await this.em.find(
            ControlEntityUser,
            { controlEntity: id },
            { populate: ['user'] },
        );

        return controlEntityUsers.map(relation => relation.user);
    }

    async create(dto: CreateControlEntityDto): Promise<ControlEntity> {
        const controlEntity = new ControlEntity();
        wrap(controlEntity).assign({
            name: dto.name,
            address: dto.address,
            phone: dto.phone,
        });

        await this.em.persistAndFlush(controlEntity);
        return controlEntity;
    }

    async findAll() {
        return this.controlRepo.findAll();
    }

    async groupByStatus(controlEntityId: string) {
        const knex = this.incidentRepository.getEntityManager().getConnection().getKnex();

        const result = await knex('incidents as i')
            .select('i.status')
            .count('i.id as total')
            .join('control_entity_users as ceu', 'ceu.user_id', 'i.assigned_to_id')
            .join('control_entities as ce', 'ce.id', 'ceu.control_entity_id')
            .where('ce.id', controlEntityId)
            .groupBy('i.status');

        return result.map((r: any) => ({
            status: r.status,
            total: Number(r.total),
        }));
    }
}
