import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
// import { CreateAvailabilityZoneDto } from './dto/create-availability-zone.dto';
// import { UpdateAvailabilityZoneDto } from './dto/update-availability-zone.dto';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { UserEntity } from 'src/user/user.entity';

// import { AvailabilityZoneQueryFilterDto } from './dto/availability-zone-find-options.dto';

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
}
