import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import databaseConfig from './config/mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    AuthModule,
    UserModule,
    MikroOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
