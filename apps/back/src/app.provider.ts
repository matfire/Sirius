import { PubSub } from 'graphql-subscriptions';

export const PubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
};
