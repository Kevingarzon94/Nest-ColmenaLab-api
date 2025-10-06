import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment date',
    example: '2025-10-15',
  })
  @IsDateString({}, { message: 'The appointment date must be valid' })
  @IsNotEmpty({ message: 'The appointment date is required' })
  appointmentDate: string;

  @ApiProperty({
    description: 'Doctor ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'The doctor ID must be a valid UUID' })
  @IsNotEmpty({ message: 'The doctor ID is required' })
  doctorId: string;

  @ApiProperty({
    description: 'Patient ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4', { message: 'The patient ID must be a valid UUID' })
  @IsNotEmpty({ message: 'The patient ID is required' })
  patientId: string;
}
