import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

@ApiTags('Medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a medication' })
  @ApiResponse({
    status: 200,
    description: 'Medication created successfully',
  })
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all medications' })
  @ApiResponse({
    status: 200,
    description: 'List of medications',
  })
  findAll() {
    return this.medicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medication by ID' })
  @ApiParam({
    name: 'id',
    description: 'Medication ID',
  })
  findOne(@Param('id') id: string) {
    return this.medicationsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a medication' })
  @ApiParam({
    name: 'id',
    description: 'Medication ID',
  })
  remove(@Param('id') id: string) {
    return this.medicationsService.remove(id);
  }
}
