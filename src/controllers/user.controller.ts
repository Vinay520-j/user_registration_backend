import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorator/role.decorator';
import { CreateUserDto } from 'src/dtos/CreateUser.dtos';
import { Role } from 'src/enum';
import { JwtGuard } from 'src/guard/jetguard';
import { LocalAuthGuard } from 'src/guard/localgurd';
import { RefershJwtGuard } from 'src/guard/refreshguard';
import { RolesGuard } from 'src/guard/roles';
import { UserService } from 'src/services/user.service';



@Controller('/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

@Post('/signup')
async createUser(
  @Body() createUserDto: CreateUserDto,
) {
  try {
      const data = await this.appService.SignupUser(createUserDto);
  return {
    message: "User Created Successfully",
    data: data,
  };
  } catch (error) {
    console.log(error)
    throw error
  }

}

   @UseGuards(LocalAuthGuard)
   @Post('/login')
   async Login(@Req() req:any){
        console.log('HHHHH',req.user)
       return await this.appService.Login(req.user)
   }

   

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtGuard)
   @Get('/fetch-all-user')
   GetallUser(){
       return this.appService.GetAlluser()
   }

   @UseGuards(RefershJwtGuard)
   @Post('refresh')
   async refreshToken(@Req() req:any)
   {
    return this.appService.refreshToken(req.user)
   }
     @Post('/send-otp')
    async sendOtp(@Body('email') email: string) {
    return this.appService.sendOtp(email);
  }
    @Post('/reset-password')
  async resetPassword(
    @Body() body: { email: string; otp: string; newPassword: string },
  ) {
    return this.appService.resetPassword(body.email, body.otp, body.newPassword);
  }
}
