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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Doctors')
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new doctor' })
  @ApiResponse({
    status: 200,
    description: 'Doctor registered successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Doctor already registered',
  })
  @ApiResponse({
    status: 500,
    description: 'Error registering doctor',
  })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all doctors' })
  @ApiResponse({
    status: 200,
    description: 'List of doctors retrieved successfully',
  })
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search doctor by identification number' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Doctor identification number',
    example: '9876543210',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor found',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  findByIdentification(@Query('id') id: string) {
    return this.doctorsService.findByIdentification(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a doctor by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique doctor ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor found',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiParam({
    name: 'id',
    description: 'Unique doctor ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing data',
  })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiParam({
    name: 'id',
    description: 'Unique doctor ID (UUID)',
  })
  @ApiResponse({
    status: 204,
    description: 'Doctor deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
