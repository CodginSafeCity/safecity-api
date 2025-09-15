import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, RoleEntity, CityEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
