import { Inject } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Record } from './record.model';
import { RecordService } from './record.service';

@Resolver((of) => Record)
export class RecordResolver {
  constructor(private recordService: RecordService) {
    this.pubsub = new PubSub();
  }

  @Inject('PUB_SUB')
  pubsub: PubSub;

  @Query(() => [Record])
  async records() {
    return this.recordService.records();
  }

  @Query(() => Record)
  async lastRecord() {
    return this.recordService.lastRecord();
  }

  @Subscription(() => Record)
  recordCreated() {
    return this.pubsub.asyncIterator('recordCreated');
  }
}
