import { Injectable, Logger, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { BusinessException, BusinessErrorCodes } from '../../common/exceptions/business.exception';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const doctor = await this.doctorsService.findOne(createAppointmentDto.doctorId);

      const patient = await this.patientsService.findOne(createAppointmentDto.patientId);

      const isAvailable = await this.isDoctorAvailable(
        createAppointmentDto.doctorId,
        createAppointmentDto.appointmentDate,
      );

      if (!isAvailable) {
        throw new BusinessException(
          BusinessErrorCodes.DOCTOR_NOT_AVAILABLE,
          `The doctor is not available on the date ${createAppointmentDto.appointmentDate}`,
          HttpStatus.CONFLICT,
        );
      }

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        status: AppointmentStatus.PROGRAMADA,
      });

      const savedAppointment = await this.appointmentRepository.save(appointment);

      this.logger.log(`Appointment created: ${savedAppointment.appointmentId}`);
      return savedAppointment;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error creating appointment', error.stack);
      throw new InternalServerErrorException({
        code: BusinessErrorCodes.APPOINTMENT_CREATION_FAILED,
        message: 'Failed to create the appointment',
      });
    }
  }

  async findAll(): Promise<Appointment[]> {
    try {
      return await this.appointmentRepository.find({
        order: { appointmentDate: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Error retrieving appointments list', error.stack);
      throw new InternalServerErrorException('Error retrieving the list of appointments');
    }
  }

  async findOne(appointmentId: string): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['medicalOrders'],
      });

      if (!appointment) {
        throw new BusinessException(
          BusinessErrorCodes.APPOINTMENT_NOT_FOUND,
          `Appointment with ID ${appointmentId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return appointment;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error retrieving appointment', error.stack);
      throw new InternalServerErrorException('Error retrieving appointment');
    }
  }

  async findByPatientAndDate(patientId: string, date: string): Promise<Appointment[]> {
    try {
      return await this.appointmentRepository.find({
        where: {
          patientId,
          appointmentDate: new Date(date),
        },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Error retrieving appointments by patient and date', error.stack);
      throw new InternalServerErrorException('Error retrieving appointments by patient and date');
    }
  }

  async getAvailableDoctors(date: string) {
    try {
      const allDoctors = await this.doctorsService.findAll();
      const availableDoctors: Doctor[] = [];

      for (const doctor of allDoctors) {
        const isAvailable = await this.isDoctorAvailable(doctor.doctorId, date);
        if (isAvailable) {
          availableDoctors.push(doctor);
        }
      }

      return availableDoctors;
    } catch (error) {
      this.logger.error('Error retrieving available doctors', error.stack);
      throw new InternalServerErrorException('Error retrieving available doctors');
    }
  }

  async updateStatus(
    appointmentId: string,
    updateStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findOne(appointmentId);

      appointment.status = updateStatusDto.status;
      appointment.statusUpdatedAt = new Date();

      const updatedAppointment = await this.appointmentRepository.save(appointment);

      this.logger.log(`Appointment status updated: ${appointmentId} -> ${updateStatusDto.status}`);
      return updatedAppointment;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error updating appointment status', error.stack);
      throw new InternalServerErrorException('Error updating appointment status');
    }
  }

  async remove(appointmentId: string): Promise<void> {
    try {
      const appointment = await this.findOne(appointmentId);
      await this.appointmentRepository.remove(appointment);

      this.logger.log(`Appointment deleted: ${appointmentId}`);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error('Error deleting appointment', error.stack);
      throw new InternalServerErrorException('Error deleting appointment');
    }
  }

  private async isDoctorAvailable(doctorId: string, date: string): Promise<boolean> {
    const appointmentsOnDate = await this.appointmentRepository.find({
      where: {
        doctorId,
        appointmentDate: new Date(date),
      },
    });

    return appointmentsOnDate.length === 0;
  }
}
