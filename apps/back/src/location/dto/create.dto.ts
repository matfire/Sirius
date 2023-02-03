import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType()
export class LocationCreateDTO {
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
}
