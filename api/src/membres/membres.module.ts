import { Module } from '@nestjs/common';
import { MembresService } from './membres.service';
import { MembresController } from './membres.controller';

@Module({
  controllers: [MembresController],
  providers: [MembresService],
  exports: [MembresService],
})
export class MembresModule {}
