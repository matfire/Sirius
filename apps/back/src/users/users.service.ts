import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { ...data, password } });
  }
  async login(data: LoginDTO): Promise<boolean> {
    const user = await this.findOne(data.email);
if (!user) {
  throw UnauthorizedException;
}

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw UnauthorizedException;
    }
    return true;
  }
}
