import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_WEEK)
  async purgeDb() {
    this.logger.debug('purging records older than a week');
    const date = new Date();
    const { count } = await this.prismaService.record.deleteMany({
      where: {
        date: {
          lte: date,
        },
      },
    });
    this.logger.debug(`removed ${count} rows`);
  }
}
