import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  last_name!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  avatar?: string;

  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;

  @ManyToOne(() => CityEntity, { nullable: true })
  city?: CityEntity;

  @Property({ nullable: true, name: 'reset_token' })
  resetToken?: string;

  @Property({ nullable: true, name: 'reset_token_expires_at', type: 'timestamptz' })
  resetTokenExpiresAt?: Date;
}
