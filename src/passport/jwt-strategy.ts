import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy} from "passport-jwt"
import { UserService } from "src/services/user.service";

@Injectable()
export  class JwtStartegy extends PassportStrategy(Strategy,'jwt'){
    constructor(private appService: UserService ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:`${process.env.jwt_secret}`
        })
    }

    async validate(payload:any) {
        console.log('+++',payload)
        const userId = payload.sub
        // return {user: payload.sub, email:payload.email}
        console.log('Jackkk',userId)
        return this.appService.validateJwtUser(userId.id)
    }
}