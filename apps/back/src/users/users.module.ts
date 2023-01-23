import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UserResolver],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
