import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateMedicalOrderDto {
  @ApiProperty({
    description: 'Appointment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'The appointment ID must be a valid UUID' })
  @IsNotEmpty({ message: 'The appointment ID is required' })
  appointmentId: string;

  @ApiProperty({
    description: 'Medical order description',
    example: 'Perform complete blood tests',
  })
  @IsString()
  @IsNotEmpty({ message: 'The description is required' })
  description: string;

  @ApiProperty({
    description: 'Expiration date of the medical order',
    example: '2025-11-15',
  })
  @IsDateString({}, { message: 'The expiration date must be valid' })
  @IsNotEmpty({ message: 'The expiration date is required' })
  expirationDate: string;

  @ApiProperty({
    description: 'Medical specialty',
    example: 'Clinical Laboratory',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'The specialty is required' })
  @MaxLength(100, { message: 'The specialty cannot exceed 100 characters' })
  specialty: string;

  @ApiProperty({
    description: 'Medication IDs (optional)',
    example: ['123e4567-e89b-12d3-a456-426614174002'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true, message: 'Each medication ID must be a valid UUID' })
  medicationIds?: string[];
}
