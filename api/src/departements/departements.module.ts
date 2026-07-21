import { Module } from '@nestjs/common';
import { DepartementsService } from './departements.service';
import { DepartementsController } from './departements.controller';

@Module({
  controllers: [DepartementsController],
  providers: [DepartementsService],
  exports: [DepartementsService],
})
export class DepartementsModule {}
