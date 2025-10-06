import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MedicalOrdersService } from './medical-orders.service';
import { CreateMedicalOrderDto } from './dto/create-medical-order.dto';

@ApiTags('Medical Orders')
@Controller('medical-orders')
export class MedicalOrdersController {
  constructor(private readonly medicalOrdersService: MedicalOrdersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a medical order' })
  @ApiResponse({
    status: 200,
    description: 'Medical order created successfully',
  })
  create(@Body() createMedicalOrderDto: CreateMedicalOrderDto) {
    return this.medicalOrdersService.create(createMedicalOrderDto);
  }

  @Get('appointment/:appointmentId')
  @ApiOperation({ summary: 'Get medical orders for an appointment' })
  @ApiParam({
    name: 'appointmentId',
    description: 'Appointment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Medical orders found',
  })
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.medicalOrdersService.findByAppointment(appointmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medical order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Medical order ID',
  })
  findOne(@Param('id') id: string) {
    return this.medicalOrdersService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a medical order' })
  @ApiParam({
    name: 'id',
    description: 'Medical order ID',
  })
  remove(@Param('id') id: string) {
    return this.medicalOrdersService.remove(id);
  }
}
