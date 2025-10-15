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

}
