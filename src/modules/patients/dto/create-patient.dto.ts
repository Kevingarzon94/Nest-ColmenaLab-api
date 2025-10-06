import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Unique identifier for the patient',
    example: '1234567890',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'ID is required' })
  @MaxLength(20, { message: 'ID can be at most 20 characters long' })
  @Matches(/^[0-9]+$/, { message: 'ID can only contain numbers' })
  id: string;

  @ApiProperty({
    description: 'First name of the patient',
    example: 'Juan',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(90, { message: 'First name can be at most 90 characters long' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Perez',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(90, { message: 'Last name can be at most 90 characters long' })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'juanperez@gmail.com',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(200, { message: 'Email can be at most 200 characters long' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '5551234567',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MaxLength(20, { message: 'Phone number can be at most 20 characters long' })
  @Matches(/^[0-9]+$/, { message: 'Phone number can only contain numbers' })
  phone: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: 'cra 10 #20-30',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(200, { message: 'Address can be at most 200 characters long' })
  address: string;

  @ApiProperty({
    description: 'City where the patient resides',
    example: 'Medellin',
    maxLength: 90,
  })
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(90, { message: 'City can be at most 90 characters long' })
  city: string;
}
