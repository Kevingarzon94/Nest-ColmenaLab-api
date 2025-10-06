import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalOrdersService } from './medical-orders.service';
import { MedicalOrdersController } from './medical-orders.controller';
import { MedicalOrder } from './entities/medical-order.entity';
import { Medication } from '../medications/entities/medication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalOrder, Medication])],
  controllers: [MedicalOrdersController],
  providers: [MedicalOrdersService],
  exports: [MedicalOrdersService],
})
export class MedicalOrdersModule {}
