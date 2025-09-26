import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter:any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'smtp.sendgrid.net',
      auth: {
        user:process.env.MAIL_USER, 
        pass:process.env.MAIL_PASS, 
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    console.log({
      to,
      subject,
      text,
    })
    await this.transporter.sendMail({
      from:process.env.MAIL_USER,
      to,
      subject,
      text,
    });
  }
}
