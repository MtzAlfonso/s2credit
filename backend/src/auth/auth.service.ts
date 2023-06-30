import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateMD5Hash } from 'src/shared/utils/hash';
import { User } from '@prisma/client';
import { RegisterUserDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, ILoginResponse } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: IJwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async create(createAuthDto: RegisterUserDto): Promise<Partial<User>> {
    try {
      return await this.prisma.user.create({
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
        data: {
          username: createAuthDto.username,
          firstName: createAuthDto.firstName,
          lastName: createAuthDto.lastName,
          // NOTE: será un MD5 del username agregando el primer nombre del desarrollador
          password: generateMD5Hash(
            `${createAuthDto.username}${createAuthDto.firstName}`,
          ),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(createAuthDto: RegisterUserDto): Promise<ILoginResponse> {
    try {
      const user = await this.create(createAuthDto);

      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    try {
      const { username, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      if (user.password !== generateMD5Hash(password))
        throw new UnauthorizedException('Invalid credentials');

      delete user.password;

      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  async validateUser(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user?.id) throw new UnauthorizedException('Invalid token');
      if (!user?.isActive)
        throw new UnauthorizedException('User is not active');

      delete user.password;

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async revalidate(id: string): Promise<ILoginResponse> {
    try {
      const user = await this.validateUser(id);

      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.code === 'P2002') {
      throw new BadRequestException('Username already exists');
    }
    if (error instanceof UnauthorizedException) throw error;
    if (error instanceof BadRequestException) throw error;

    throw new InternalServerErrorException('Internal Server Error');
  }
}
