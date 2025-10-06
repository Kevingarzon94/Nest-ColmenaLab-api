import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ username: registerDto.username }, { email: registerDto.email }],
      });

      if (existingUser) {
        throw new ConflictException('The username or email is already registered');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        role: registerDto.role || UserRole.PATIENT,
      });

      const savedUser = await this.userRepository.save(user);

      this.logger.log(`User registered: ${savedUser.username}`);

      const payload = {
        sub: savedUser.userId,
        username: savedUser.username,
        role: savedUser.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          userId: savedUser.userId,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error registering user', error.stack);
      throw new Error('Error registering user');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: [{ username: loginDto.username }, { email: loginDto.username }],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Inactive user');
      }

      this.logger.log(`User authenticated: ${user.username}`);

      const payload = {
        sub: user.userId,
        username: user.username,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Error during authentication', error.stack);
      throw new UnauthorizedException('Authentication error');
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid user');
    }
    return user;
  }
}
