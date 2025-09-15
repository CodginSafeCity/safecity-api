import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import databaseConfig from './config/mikro-orm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // MikroOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
