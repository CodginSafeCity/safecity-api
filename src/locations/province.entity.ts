import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'provinces' })
export class ProvinceEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property({ type: 'geometry', nullable: true })
  location?: any;
}
