import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { ControlEntityUserService } from 'src/control-entity-user/control-entity-user.service';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, RoleEntity, CityEntity, ControlEntityUser]), MailerModule],
  providers: [UserService, ControlEntityUserService],
  controllers: [UserController],
  exports: [UserService, ControlEntityUserService, MikroOrmModule],
})
export class UserModule {}
