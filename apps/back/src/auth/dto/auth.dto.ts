import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthDTO {
  @Field(() => String)
  access_token: string;
}
