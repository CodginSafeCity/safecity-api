import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ControlEntityController } from 'src/control-entities/control-entities.controller';
import { ControlEntityService } from 'src/control-entities/control-entities.service';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { UserService } from 'src/user/user.service';
import { RoleEntity } from 'src/roles/role.entity';
import { UserEntity } from 'src/user/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { ControlEntityUserService } from 'src/control-entity-user/control-entity-user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      AvailabilityZoneEntity,
      CityEntity,
      ControlEntity,
      ControlEntityUser,
      RoleEntity,
      UserEntity
    ]),
  ],
  controllers: [ControlEntityController],
  providers: [ControlEntityService, UserService, MailerService, ControlEntityUserService],
  exports: [ControlEntityService, UserService, MailerService, ControlEntityUserService],
})
export class ControlEntityModule {}