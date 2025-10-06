import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        code,
        message,
        error: 'Business Exception',
      },
      statusCode,
    );
  }
}

export const BusinessErrorCodes = {
  PATIENT_ALREADY_EXISTS: 'PATIENT_ALREADY_EXISTS',
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  PATIENT_CREATION_FAILED: 'PATIENT_CREATION_FAILED',
  PATIENT_UPDATE_FAILED: 'PATIENT_UPDATE_FAILED',
  PATIENT_DELETE_FAILED: 'PATIENT_DELETE_FAILED',

  DOCTOR_ALREADY_EXISTS: 'DOCTOR_ALREADY_EXISTS',
  DOCTOR_NOT_FOUND: 'DOCTOR_NOT_FOUND',
  DOCTOR_CREATION_FAILED: 'DOCTOR_CREATION_FAILED',
  DOCTOR_UPDATE_FAILED: 'DOCTOR_UPDATE_FAILED',
  DOCTOR_DELETE_FAILED: 'DOCTOR_DELETE_FAILED',

  APPOINTMENT_NOT_FOUND: 'APPOINTMENT_NOT_FOUND',
  APPOINTMENT_CREATION_FAILED: 'APPOINTMENT_CREATION_FAILED',
  DOCTOR_NOT_AVAILABLE: 'DOCTOR_NOT_AVAILABLE',
  INVALID_APPOINTMENT_STATUS: 'INVALID_APPOINTMENT_STATUS',
};
