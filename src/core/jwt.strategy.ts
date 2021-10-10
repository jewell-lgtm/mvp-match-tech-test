import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload';
import { transformAndValidate } from 'class-transformer-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super secret private key',
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return (await transformAndValidate(JwtPayload, payload)) as JwtPayload;
  }
}
