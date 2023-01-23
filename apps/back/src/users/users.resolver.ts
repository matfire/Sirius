import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './users.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    console.log(user);
    return this.userService.findById(user.id);
  }
}
