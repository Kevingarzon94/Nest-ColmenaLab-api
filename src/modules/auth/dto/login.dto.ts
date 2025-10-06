import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email',
    example: 'jperez',
  })
  @IsString()
  @IsNotEmpty({ message: 'The username is required' })
  username: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty({ message: 'The password is required' })
  password: string;
}
