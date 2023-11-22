import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayloadDto } from "../dtos/token-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: TokenPayloadDto): TokenPayloadDto {
    return payload;
  }
}