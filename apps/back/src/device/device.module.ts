import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [DeviceService, DeviceResolver],
  imports: [PrismaModule],
})
export class DeviceModule {}
