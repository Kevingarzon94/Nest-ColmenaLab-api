import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    description: 'Username',
    example: 'jperez',
  })
  @IsString()
  @IsNotEmpty({ message: 'The username is required' })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'jperez@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'The email address is required' })
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PATIENT,
    required: false,
  })
  @IsEnum(UserRole, { message: 'The role must be ADMIN, DOCTOR, or PATIENT' })
  @IsOptional()
  role?: UserRole;
}
