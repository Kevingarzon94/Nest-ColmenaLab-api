import { Post, HttpCode, HttpStatus, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patient')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({
    status: 200,
    description: 'Registered patient successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Patient with given ID or email already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Error registering patient',
  })
  create(@Body() CreatePatientDto: CreatePatientDto) {
    return this.patientsService.create(CreatePatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all patients' })
  @ApiResponse({
    status: 200,
    description: 'List of patients retrieved successfully',
  })
  findAll() {
    return this.patientsService.findALL();
  }

  @Get('search')
  @ApiOperation({ summary: 'Find patients by identification' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Identification of the patient',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  findByIdentification(@Query('id') id: string) {
    return this.patientsService.findByIdentification(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Patient with id' })
  @ApiParam({
    name: 'id',
    description: 'id unique to the patient (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiParam({
    name: 'id',
    description: 'ID unique patient (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Patient with given ID or email already exists',
  })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiParam({
    name: 'id',
    description: 'ID unique patient (UUID)',
  })
  @ApiResponse({
    status: 204,
    description: 'Patient deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
