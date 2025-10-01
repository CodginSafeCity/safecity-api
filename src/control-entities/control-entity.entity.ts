import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { ControlEntityUser } from './control-entity-user.entity';

@Entity({ tableName: 'control_entities' })
export class ControlEntity extends BaseEntity {

  @Property()
  name!: string;

  @Property()
  address!: string;

  @Property()
  phone!: string;

  @OneToMany(() => AvailabilityZoneEntity, zone => zone.controlEntity)
  availabilityZones = new Collection<AvailabilityZoneEntity>(this);

  @OneToMany(() => ControlEntityUser, ceu => ceu.controlEntity)
  controlEntityUsers = new Collection<ControlEntityUser>(this);
}
