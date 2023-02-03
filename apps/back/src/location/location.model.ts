import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Location {
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
  @Field(() => Int)
  id: number;
}
