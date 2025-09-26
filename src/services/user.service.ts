import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/User";
import { CreateUserParams, CurrentUser } from "src/utils/types";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { MailerService } from "./mail.service";


@Injectable()
export class UserService {

   constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService:MailerService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  SignupUser(createUserDetails:CreateUserParams) {
    const newUser = this.userRepository.create({
      ...createUserDetails,
      createdAt: new Date()
    })
   return  this.userRepository.save(newUser)
  }
    Login(user:User){
     const payload = {
      email:user.email,
      role:user.role,
      sub:{
        name:user.name,
        id:user.id
      }
    
     }
       return {
        ...user,
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {expiresIn:'7d'})
      }
  }

  async validateUser(email: string, password: string)
  {
    const user = await this.userRepository.findOne({where:{email}})
    console.log(user)
       if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException("Invalid credentials");
  }

   GetAlluser() {
      return this.userRepository.find()
   } 

      refreshToken(user:User){
     const payload = {
      email:user.email,
      role:user.role,
      sub:{
        name:user.name
      }
    
     }
       return {
        accessToken: this.jwtService.sign(payload),
      }
  }

  async validateJwtUser(userId:number){
    const user = await this.userRepository.findOne({where:{id:userId}})
    if(!user) throw new UnauthorizedException('user not found')
    const currentUser: CurrentUser = {id:user.id,role:user.role}

    return currentUser
  }

    async sendOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min expiry

    user.otp = otp;
    user.otpExpiry = expiry;
    await this.userRepository.save(user);

    await this.mailerService.sendMail(
      user.email,
      'Password Reset OTP',
      `Your OTP is ${otp}. It will expire in 5 minutes.`,
    );

      return {
    message:"Otp sent to email",
    email: user.email,
    otp: otp, 
    expiresAt: new Date(expiry).toISOString(),
  };
  }

    async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email');

    if (user.otp !== otp || Date.now() > Number(user.otpExpiry)) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.password = newPassword;
    user.otp = '';
    user.otpExpiry = 0;

    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }


  }



