import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { RecordResolver } from './record.resolver';
import { PubSubProvider } from 'src/app.provider';

@Module({
  controllers: [RecordController],
  providers: [RecordService, RecordResolver, PubSubProvider],
  imports: [PrismaModule],
})
export class RecordModule {}
