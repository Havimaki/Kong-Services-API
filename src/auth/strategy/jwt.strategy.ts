import { Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/jwt.constants';
import { ValidateJWTDto } from '../dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  name: string = 'LocalStrategy';
  private readonly logger = new Logger();

  async validate(payload: ValidateJWTDto) {
    this.logger.log(this.name, 'validate.')
    return { userId: payload.sub, username: payload.username };
  }
}