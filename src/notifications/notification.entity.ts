import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'notifications' })
export class Notification extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ type: 'timestamp', nullable: true })
  read_at?: Date;
}
