import {
  BaseEntity as MikroOrmBaseEntity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class BaseEntity extends MikroOrmBaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id = v4();

  @Property({ defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}