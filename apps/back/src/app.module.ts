import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RecordModule } from './record/record.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PubSubProvider } from './app.provider';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    RecordModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws':true
      }
    }),
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PubSubProvider],
})
export class AppModule {}
