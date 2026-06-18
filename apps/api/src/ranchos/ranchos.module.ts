import { Module } from '@nestjs/common';
import { RanchosController } from './ranchos.controller';
import { RanchosService } from './ranchos.service';

@Module({
  controllers: [RanchosController],
  providers: [RanchosService],
})
export class RanchosModule {}
