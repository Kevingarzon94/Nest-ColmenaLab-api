import { Injectable, Logger, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BusinessException, BusinessErrorCodes } from '../../common/exceptions/business.exception';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      // Check if a doctor already exists by ID, email, or professional card
      const existingDoctor = await this.doctorRepository.findOne({
        where: [
          { id: createDoctorDto.id },
          { email: createDoctorDto.email },
          { professionalCard: createDoctorDto.professionalCard },
        ],
      });

      if (existingDoctor) {
        throw new BusinessException(
          BusinessErrorCodes.DOCTOR_ALREADY_EXISTS,
          `Doctor with ID ${createDoctorDto.id}, email ${createDoctorDto.email}, or professional card ${createDoctorDto.professionalCard} is already registered`,
          HttpStatus.CONFLICT,
        );
      }

      const doctor = this.doctorRepository.create(createDoctorDto);
      const savedDoctor = await this.doctorRepository.save(doctor);

      this.logger.log(`Doctor created successfully: ${savedDoctor.doctorId}`);
      return savedDoctor;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error creating doctor', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.DOCTOR_CREATION_FAILED,
        message: 'Failed to register the doctor. Please try again.',
      });
    }
  }

  async findAll(): Promise<Doctor[]> {
    try {
      return await this.doctorRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Error retrieving doctors list', error.stack);
      throw new InternalServerErrorException('Error retrieving the list of doctors');
    }
  }

  async findOne(doctorId: string): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { doctorId },
      });

      if (!doctor) {
        throw new BusinessException(
          BusinessErrorCodes.DOCTOR_NOT_FOUND,
          `Doctor with ID ${doctorId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return doctor;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error retrieving doctor', error.stack);
      throw new InternalServerErrorException('Error retrieving doctor');
    }
  }

  async findByIdentification(id: string): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { id },
      });

      if (!doctor) {
        throw new BusinessException(
          BusinessErrorCodes.DOCTOR_NOT_FOUND,
          `Doctor with identification ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return doctor;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error retrieving doctor by identification', error.stack);
      throw new InternalServerErrorException('Error retrieving doctor by identification');
    }
  }

  async update(doctorId: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    try {
      const doctor = await this.findOne(doctorId);

      // Check if the new ID, email, or professional card is already registered for another doctor
      if (updateDoctorDto.id || updateDoctorDto.email || updateDoctorDto.professionalCard) {
        const existingDoctor = await this.doctorRepository.findOne({
          where: [
            { id: updateDoctorDto.id },
            { email: updateDoctorDto.email },
            { professionalCard: updateDoctorDto.professionalCard },
          ],
        });

        if (existingDoctor && existingDoctor.doctorId !== doctorId) {
          throw new BusinessException(
            BusinessErrorCodes.DOCTOR_ALREADY_EXISTS,
            'The identification, email, or professional card is already registered for another doctor',
            HttpStatus.CONFLICT,
          );
        }
      }

      Object.assign(doctor, updateDoctorDto);
      const updatedDoctor = await this.doctorRepository.save(doctor);

      this.logger.log(`Doctor updated: ${doctorId}`);
      return updatedDoctor;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error updating doctor', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.DOCTOR_UPDATE_FAILED,
        message: 'Failed to update the doctor',
      });
    }
  }

  async remove(doctorId: string): Promise<void> {
    try {
      const doctor = await this.findOne(doctorId);
      await this.doctorRepository.remove(doctor);

      this.logger.log(`Doctor deleted: ${doctorId}`);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error deleting doctor', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.DOCTOR_DELETE_FAILED,
        message: 'Failed to delete the doctor',
      });
    }
  }
}
