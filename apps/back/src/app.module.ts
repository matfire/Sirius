import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RecordModule } from './record/record.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { PubSubProvider } from './app.provider';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { DeviceModule } from './device/device.module';


@Module({
  imports: [
    RecordModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws':true,
        'subscriptions-transport-ws':true
      }
    }),
    LocationModule,
    AuthModule,
    UsersModule,
    TasksModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PubSubProvider],
})
export class AppModule {}
