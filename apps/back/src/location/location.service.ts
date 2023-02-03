import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationCreateDTO } from './dto/create.dto';


@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}

  async location(id: number) {
    return this.prismaService.location.findUnique({ where: { id } });
  }
  async locations(userId: number) {
    return this.prismaService.location.findMany({
      where: {
        userId,
      },
    });
  }
  async create(data: LocationCreateDTO, userId: number) {
    return this.prismaService.location.create({ data: { ...data, userId } });
  }
  async delete(id: number, userId: number) {
    const location = await this.prismaService.location.findUnique({
      where: { id },
    });
    if (location.userId !== userId) {
      throw UnauthorizedException;
    }
    return this.prismaService.location.delete({ where: { id } });
  }
}

