import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Record {
  @Field((type) => Int)
  id: number;

  @Field((type) => Date)
  date: Date;

  @Field((type) => Float)
  latitude: number;

  @Field((type) => Float)
  longitude: number;
}
