import { HttpStatus, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { BusinessErrorCodes, BusinessException } from '../../common/exceptions/business.exception';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const existingPatient = await this.patientRepository.findOne({
        where: [{ id: createPatientDto.id }, { email: createPatientDto.email }],
      });

      if (existingPatient) {
        (BusinessErrorCodes.PATIENT_ALREADY_EXISTS,
          `Patient with ID ${createPatientDto.id} or email ${createPatientDto.email} already exists`,
          HttpStatus.CONFLICT);
      }

      const patient = this.patientRepository.create(createPatientDto);
      const savedPatient = await this.patientRepository.save(patient);

      this.logger.log(`Patient created at: ${savedPatient.patientId}`);
      return savedPatient;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logger.error('Error to create patient', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.PATIENT_CREATION_FAILED,
        message: 'Failed to create patient',
      });
    }
  }

  async findALL(): Promise<Patient[]> {
    try {
      return await this.patientRepository.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      this.logger.error('Error to get patients', error.stack);
      throw new InternalServerErrorException({
        message: 'Failed to fetch patients',
      });
    }
  }

  async findOne(patientId: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOne({ where: { patientId } });
      if (!patient) {
        throw new BusinessException(
          BusinessErrorCodes.PATIENT_NOT_FOUND,
          `Patient with ID ${patientId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return patient;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logger.error(`Error to get patient with ID ${patientId}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Failed to fetch patient',
      });
    }
  }

  async findByIdentification(id: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOne({ where: { id } });
      if (!patient) {
        throw new BusinessException(
          BusinessErrorCodes.PATIENT_NOT_FOUND,
          `Patient with identification ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return patient;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logger.error(`Error to get patient with identification ${id}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Failed to fetch patient',
      });
    }
  }

  async update(patientId: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    try {
      const patient = await this.findOne(patientId);

      if (updatePatientDto.id || updatePatientDto.email) {
        const existingPatient = await this.patientRepository.findOne({
          where: [{ id: updatePatientDto.id }, { email: updatePatientDto.email }],
        });

        if (existingPatient && existingPatient.patientId !== patientId) {
          throw new BusinessException(
            BusinessErrorCodes.PATIENT_ALREADY_EXISTS,
            'Patient with given ID or email already exists',
            HttpStatus.CONFLICT,
          );
        }
      }

      Object.assign(patient, updatePatientDto);
      const updatedPatient = await this.patientRepository.save(patient);

      this.logger.log(`Patient update: ${patientId}`);
      return updatedPatient;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error to update patient', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.PATIENT_UPDATE_FAILED,
        message: 'Failed to update patient',
      });
    }
  }

  async remove(patientId: string): Promise<void> {
    try {
      const patient = await this.findOne(patientId);
      await this.patientRepository.remove(patient);

      this.logger.log(`Patient Deleted: ${patientId}`);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error to delete patient', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.PATIENT_DELETE_FAILED,
        message: 'Failed to delete patient',
      });
    }
  }
}
