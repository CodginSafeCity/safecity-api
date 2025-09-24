import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IncidentCategoryEntity } from './incident-category.entity';
import { IncidentCategoryService } from './incident-category.service';
import { IncidentCategoryController } from './incident-category.controller';

@Module({
  imports: [MikroOrmModule.forFeature([IncidentCategoryEntity])],
  providers: [IncidentCategoryService],
  controllers: [IncidentCategoryController],
  exports: [IncidentCategoryService],
})
export class IncidentCategoryModule {}
