import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Record } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  @Inject('PUB_SUB')
  pubsub: PubSub;

  async createRecord(data: Prisma.RecordCreateInput): Promise<Record> {
    const res = await this.prisma.record.create({ data });
    this.pubsub.publish('recordCreated', { recordCreated: res });
    return res;
  }

  async records(): Promise<Record[]> {
    return this.prisma.record.findMany();
  }

  async lastRecord(): Promise<Record> {
    const records = await this.prisma.record.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return records[0];
  }
}
