import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from './control-entity.entity';

@Entity({ tableName: 'control_entity_users' })
export class ControlEntityUser extends BaseEntity {

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ControlEntity)
  controlEntity!: ControlEntity;
}
