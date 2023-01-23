import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDTO {
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  username: string;
}
