import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid';

@Injectable()
export class MailerService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport(
      sgTransport({
        apiKey: process.env.SENDGRID_API_KEY, // Use your SendGrid API key here
      }),
    );
  }

  async sendMail(to: string, subject: string, text: string) {
    console.log({
      to,
      subject,
      text,
    });

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM, 
      to,
      subject,
      text,
    });
  }
}
