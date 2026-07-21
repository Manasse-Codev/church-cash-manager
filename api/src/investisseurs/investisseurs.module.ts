import { Module } from '@nestjs/common';
import { InvestisseursService } from './investisseurs.service';
import { InvestisseursController } from './investisseurs.controller';

@Module({
  controllers: [InvestisseursController],
  providers: [InvestisseursService],
  exports: [InvestisseursService],
})
export class InvestisseursModule {}
