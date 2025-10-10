import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'control_entity_users' })
export class ControlEntityUser extends BaseEntity{
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ControlEntity)
  controlEntity!: ControlEntity;
}
