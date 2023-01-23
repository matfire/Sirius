import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  username: string;
}
