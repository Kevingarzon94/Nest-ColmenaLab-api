import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MedicalOrder } from './entities/medical-order.entity';
import { CreateMedicalOrderDto } from './dto/create-medical-order.dto';
import { Medication } from '../medications/entities/medication.entity';

@Injectable()
export class MedicalOrdersService {
  private readonly logger = new Logger(MedicalOrdersService.name);

  constructor(
    @InjectRepository(MedicalOrder)
    private readonly medicalOrderRepository: Repository<MedicalOrder>,
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  async create(createMedicalOrderDto: CreateMedicalOrderDto): Promise<MedicalOrder> {
    try {
      const medicalOrder = this.medicalOrderRepository.create(createMedicalOrderDto);

      // If there are medications, attach them
      if (createMedicalOrderDto.medicationIds && createMedicalOrderDto.medicationIds.length > 0) {
        const medications = await this.medicationRepository.find({
          where: { medicationId: In(createMedicalOrderDto.medicationIds) },
        });
        medicalOrder.medications = medications;
      }

      const saved = await this.medicalOrderRepository.save(medicalOrder);
      this.logger.log(`Medical order created: ${saved.orderId}`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating medical order', error.stack);
      throw new InternalServerErrorException('Failed to create the medical order');
    }
  }

  async findByAppointment(appointmentId: string): Promise<MedicalOrder[]> {
    try {
      return await this.medicalOrderRepository.find({
        where: { appointmentId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Error retrieving medical orders', error.stack);
      throw new InternalServerErrorException('Error retrieving medical orders');
    }
  }

  async findOne(orderId: string): Promise<MedicalOrder> {
    try {
      const order = await this.medicalOrderRepository.findOne({
        where: { orderId },
      });

      if (!order) {
        throw new InternalServerErrorException('Medical order not found');
      }

      return order;
    } catch (error) {
      this.logger.error('Error retrieving medical order', error.stack);
      throw new InternalServerErrorException('Error retrieving medical order');
    }
  }

  async remove(medicalOrderId: string): Promise<void> {
    try {
      const order = await this.findOne(medicalOrderId);
      await this.medicalOrderRepository.remove(order);
      this.logger.log(`Medical order deleted: ${medicalOrderId}`);
    } catch (error) {
      this.logger.error('Error deleting medical order', error.stack);
      throw new InternalServerErrorException('Failed to delete the medical order');
    }
  }
}
