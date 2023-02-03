import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  providers: [LocationResolver, LocationService],
  imports: [PrismaModule]
})
export class LocationModule {}
