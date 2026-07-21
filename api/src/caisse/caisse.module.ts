import { Module } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { CaisseController } from './caisse.controller';

@Module({
  controllers: [CaisseController],
  providers: [CaisseService],
  exports: [CaisseService],
})
export class CaisseModule {}
