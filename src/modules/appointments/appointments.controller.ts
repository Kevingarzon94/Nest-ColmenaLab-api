import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 200, description: 'Appointment created successfully' })
  @ApiResponse({ status: 404, description: 'Doctor or patient not found' })
  @ApiResponse({ status: 409, description: 'Doctor not available on that date' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all appointments' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('available-doctors')
  @ApiOperation({ summary: 'Get available doctors for a date' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Desired date (YYYY-MM-DD)',
    example: '2025-10-15',
  })
  @ApiResponse({ status: 200, description: 'List of available doctors' })
  getAvailableDoctors(@Query('date') date: string) {
    return this.appointmentsService.getAvailableDoctors(date);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search appointments by patient and date' })
  @ApiQuery({ name: 'patientId', required: true, description: 'Patient ID' })
  @ApiQuery({ name: 'date', required: true, description: 'Date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Appointments found' })
  findByPatientAndDate(@Query('patientId') patientId: string, @Query('date') date: string) {
    return this.appointmentsService.findByPatientAndDate(patientId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment found' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status (ATTENDED / NOT_ATTENDED)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateAppointmentStatusDto) {
    return this.appointmentsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 204, description: 'Appointment deleted' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
