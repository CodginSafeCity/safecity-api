import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { ControlEntityUserQueryFilterDto } from './dto/control-entity-user-query-filter.dto';

@Injectable()
export class ControlEntityUserService {
    constructor(
        @InjectRepository(ControlEntityUser)
        private readonly controlEntityUserRepo: EntityRepository<ControlEntityUser>,
        @Inject(EntityManager)
        private readonly em: EntityManager
    ) { }

    async assignUserToControlEntity(userId: string, controlEntityId: string): Promise<ControlEntityUser | null> {
        const user = await this.em.findOne(UserEntity, { id: userId });
        const controlEntity = await this.em.findOne(ControlEntity, { id: controlEntityId });

        if (!user || !controlEntity) {
            return null;
        }

        const relation = new ControlEntityUser();
        relation.userId = user;
        relation.controlEntity = controlEntity;

        await this.em.persistAndFlush(relation);
        return relation;
    }

    async find(query: ControlEntityUserQueryFilterDto) {
        const where: any = {};

        if (query.userId && query.userId !== '0' && query.userId.trim() !== '') {
            where.userId = query.userId;
        }

        if (
            query.controlEntityId &&
            query.controlEntityId !== '0' &&
            query.controlEntityId.trim() !== ''
        ) {
            where.controlEntity = query.controlEntityId;
        }

        const limit = query.limit ? Number(query.limit) : 10;
        const offset = query.offset ? Number(query.offset) : 0;

        const [data, total] = await this.em.findAndCount(ControlEntityUser, where, {
            populate: ['userId', 'controlEntity'],
            limit,
            offset,
        });

        return { data, total };
    }
}
