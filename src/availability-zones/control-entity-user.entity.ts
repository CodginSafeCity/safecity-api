import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from './control-entity.entity';

@Entity({ tableName: 'control_entity_users' })
export class ControlEntityUser {

  @PrimaryKey()
  userId!: number;

  @PrimaryKey()
  controlEntityId!: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ControlEntity)
  controlEntity!: ControlEntity;

  @Property({ columnType: 'timestamp with time zone' })
  createdAt: Date = new Date();
}
