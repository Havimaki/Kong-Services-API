import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/interface/user.interface'
import {
  validateUsernameDto,
  validatePasswordDto,
} from './dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  readonly authService: AuthService;

  async validate(username: validateUsernameDto, password: validatePasswordDto): Promise<Partial<User>> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}