import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { JwtAuthGuard, CurrentUser } from 'src/auth/jwt-auth.guard';
import { LocationCreateDTO } from './dto/create.dto';
import { Location } from './location.model';
import { LocationService } from './location.service';

@Resolver(() => Location)
export class LocationResolver {
  constructor(private locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Location])
  locations(@CurrentUser() user: User) {
    return this.locationService.locations(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Location)
  createLocation(
    @CurrentUser() user: User,
    @Args('locationInput') data: LocationCreateDTO,
  ) {
    return this.locationService.create(data, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Location)
  deleteLocation(@CurrentUser() user: User, @Args('id') id: number) {
    return this.locationService.delete(id, user.id);
  }
}
