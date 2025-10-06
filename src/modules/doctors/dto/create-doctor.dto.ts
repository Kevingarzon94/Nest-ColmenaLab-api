import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MaxLength, Matches, IsDateString } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Doctor identification (numbers only)',
    example: '9876543210',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Identification is required' })
  @MaxLength(20, { message: 'Identification cannot exceed 20 characters' })
  @Matches(/^[0-9]+$/, {
    message: 'Identification must contain only numbers',
  })
  id: string;

  @ApiProperty({
    description: "Doctor's first name",
    example: 'Ana',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(90, { message: 'First name cannot exceed 90 characters' })
  firstName: string;

  @ApiProperty({
    description: "Doctor's last name",
    example: 'Martínez',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(90, { message: 'Last name cannot exceed 90 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'ana.martinez@hospital.com',
    maxLength: 200,
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  @MaxLength(200, {
    message: 'Email address cannot exceed 200 characters',
  })
  email: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '3159876543',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phone: string;

  @ApiProperty({
    description: "Doctor's address",
    example: 'Carrera 7 # 32-16',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
  address: string;

  @ApiProperty({
    description: 'City of residence',
    example: 'Bogotá',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(90, { message: 'City cannot exceed 90 characters' })
  city: string;

  @ApiProperty({
    description: 'Professional card number',
    example: 'TP12345678',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Professional card is required' })
  @MaxLength(50, {
    message: 'Professional card cannot exceed 50 characters',
  })
  professionalCard: string;

  @ApiProperty({
    description: 'Admission date to the medical center',
    example: '2024-01-15',
    type: String,
  })
  @IsDateString({}, { message: 'Admission date must be a valid date' })
  @IsNotEmpty({ message: 'Admission date is required' })
  admissionDate: string;
}
