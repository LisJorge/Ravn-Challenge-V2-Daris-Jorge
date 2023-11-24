import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetConfirmation(user: User) {
    const { name, lastname, email } = user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password notification',
      template: './../templates/forgot-password',
      context: {
        name,
        lastname,
      },
    });
  }
}