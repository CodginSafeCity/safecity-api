import { Entity, Property, OneToMany } from '@mikro-orm/core';
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

  // Relación con Availability Zones
  @OneToMany(() => AvailabilityZoneEntity, zone => zone.controlEntity)
  availabilityZones = new Array<AvailabilityZoneEntity>();

  // Relación con tabla intermedia de usuarios
  @OneToMany(() => ControlEntityUser, cu => cu.controlEntity)
  controlEntityUsers = new Array<ControlEntityUser>();
}
