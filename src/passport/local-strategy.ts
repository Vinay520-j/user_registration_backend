import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local";
import { UserService } from "src/services/user.service";

@Injectable()
export class LocalStartegy extends PassportStrategy(Strategy)
{
     constructor(private authServices:UserService){
        super({usernameField: 'email'})
     }

     async validate(email:string,password:string)  {
        const user = await this.authServices.validateUser(email,password)
        if(!user)
        {
            throw new UnauthorizedException();
        }
        return user
     }
}