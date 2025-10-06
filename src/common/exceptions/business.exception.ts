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
};
