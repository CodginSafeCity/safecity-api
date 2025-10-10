import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import databaseConfig from './config/mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { CityModule } from './locations/city.module';
import { ConfigModule } from '@nestjs/config';
import { IncidentCategoryModule } from './incident-categories/incident-category.module';
import { IncidentModule } from './incidents/incident.module';
import { AvailabilityZonesModule } from './availability-zones/availability-zone.module';
import { ControlEntityModule } from './control-entities/control-entity.module';
import { ControlEntityUserModule } from './control-entity-user/control-entity-user.module';


@Module({
  imports: [
    AuthModule,
    CityModule,
    UserModule,
    MailerModule,
    AvailabilityZonesModule,
    IncidentCategoryModule,
    IncidentModule,
    ControlEntityModule,
    ControlEntityUserModule,
    MikroOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
