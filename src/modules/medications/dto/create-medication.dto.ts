import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Medication name',
    example: 'Ibuprofen 600mg',
  })
  @IsString()
  @IsNotEmpty({ message: 'The name is required' })
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Medication description',
    example: 'Non-steroidal anti-inflammatory drug',
  })
  @IsString()
  @IsNotEmpty({ message: 'The description is required' })
  description: string;

  @ApiProperty({
    description: 'Conditions for which the medication is prescribed',
    example: 'Pain, inflammation, fever',
  })
  @IsString()
  @IsNotEmpty({ message: 'The conditions are required' })
  diseases: string;
}
