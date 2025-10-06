import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class MedicationsService {
  private readonly logger = new Logger(MedicationsService.name);

  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    try {
      const medication = this.medicationRepository.create(createMedicationDto);
      const saved = await this.medicationRepository.save(medication);
      this.logger.log(`Medication created: ${saved.medicationId}`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating medication', error.stack);
      throw new InternalServerErrorException('Failed to create the medication');
    }
  }

  async findAll(): Promise<Medication[]> {
    try {
      return await this.medicationRepository.find({
        order: { name: 'ASC' },
      });
    } catch (error) {
      this.logger.error('Error retrieving medications', error.stack);
      throw new InternalServerErrorException('Error retrieving medications');
    }
  }

  async findOne(medicationId: string): Promise<Medication> {
    try {
      const medication = await this.medicationRepository.findOne({
        where: { medicationId },
      });

      if (!medication) {
        throw new InternalServerErrorException('Medication not found');
      }

      return medication;
    } catch (error) {
      this.logger.error('Error retrieving medication', error.stack);
      throw new InternalServerErrorException('Error retrieving medication');
    }
  }

  async remove(medicationId: string): Promise<void> {
    try {
      const medication = await this.findOne(medicationId);
      await this.medicationRepository.remove(medication);
      this.logger.log(`Medication deleted: ${medicationId}`);
    } catch (error) {
      this.logger.error('Error deleting medication', error.stack);
      throw new InternalServerErrorException('Failed to delete the medication');
    }
  }
}
