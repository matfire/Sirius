import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthDTO)
  async login(@Args('loginInput') data: LoginDTO) {
    return this.authService.login(data);
  }
  @Mutation(() => AuthDTO)
  async register(@Args('registerInput') data: RegisterDTO) {
    return this.authService.register(data);
  }
}
