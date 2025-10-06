import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'New appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.ASISTIO,
  })
  @IsEnum(AppointmentStatus, {
    message: 'The status must be SCHEDULED, ATTENDED, or NOT_ATTENDED',
  })
  @IsNotEmpty({ message: 'The status is required' })
  status: AppointmentStatus;
}
