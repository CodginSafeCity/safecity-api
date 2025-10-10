import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';

@Injectable()
export class ControlEntityUserService {
    constructor(
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

}
