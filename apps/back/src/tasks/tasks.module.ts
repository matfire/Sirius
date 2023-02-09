import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  imports: [PrismaModule],
})
export class TasksModule {}
