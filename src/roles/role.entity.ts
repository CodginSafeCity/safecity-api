import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'roles' })
export class RoleEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  description!: string;
}
