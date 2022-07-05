import {
  Logger,
  Injectable,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  validateUserDto,
  LoginUserDto,
} from './dto'
import {
  LoginUserInterface,
  ValidateUserInterface,
} from './interface'

@Injectable()
export class AuthService {
  name: string = 'AuthService';
  private readonly logger = new Logger();

  @Inject(UsersService)
  private usersService: UsersService;

  @Inject(JwtService)
  private jwtService: JwtService;

  async validateUser(payload: validateUserDto): Promise<ValidateUserInterface> {
    this.logger.log(this.name, 'validateUser.')
    const user = await this.usersService.findOne(payload.username);
    if (user && user.password === payload.password) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }

  async login(user: LoginUserDto): Promise<LoginUserInterface> {
    this.logger.log(this.name, 'login.')
    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.sign(payload);
    return { access_token: token };
  }
}