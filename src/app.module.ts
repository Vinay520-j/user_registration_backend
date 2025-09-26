import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStartegy } from './passport/local-strategy';
import { JwtStartegy } from './passport/jwt-strategy';
import { RefreshJwtStartegy } from './passport/refreshToken';
import { MailerService } from './services/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true, // so you don’t need to import it everywhere
    }),
    TypeOrmModule.forRoot({
     type:'mysql',
     host: 'localhost',
     port: 3306,
     username:'root',
     password:'123456',
     database:'user_registration',
     entities:[User],
     synchronize:true,

  }),
TypeOrmModule.forFeature([User]),
 JwtModule.register({
  secret:`${process.env.jwt_secret}`,
  signOptions:{
    expiresIn:'3600s'
  }
 })
],
  controllers: [UserController],
  providers: [UserService,LocalStartegy,JwtStartegy,RefreshJwtStartegy,MailerService],
})
export class AppModule {}
