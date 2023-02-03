import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDTO) {
    return this.userService.login(data);
  }
  async login(data: LoginDTO) {
    const valid = await this.validateUser(data);
    if (!valid) throw UnauthorizedException;

    const { password, ...payload } = await this.userService.findOne(data.email);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(data: RegisterDTO) {
    const { password, ...payload } = await this.userService.create(data);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
