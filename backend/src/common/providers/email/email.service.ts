import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EnvConfig, envConfig } from 'src/common/config/env.config';

type MailOptions = ISendMailOptions & { template?: string };

@Injectable()
export class EmailService {
  private _env: EnvConfig;

  constructor(private mailer: MailerService) {
    this._env = envConfig();
  }

  send(options: MailOptions) {
    if (this._env.mode !== 'test') {
      return this.mailer.sendMail(options);
    }
  }

  public async sendWelcome(toEmail: string): Promise<void> {
    await this.send({
      template: 'welcome',
      to: toEmail,
      subject: '🥳🎉 Welcome to the Zeta Shop',
      context: {
        siteUrl: this._env.clientUrl,
      },
    }).then();
  }

  public async sendEmailConfirmation(
    toEmail: string,
    token: string,
  ): Promise<void> {
    const tokenUrl = `${this._env.clientUrl}/activate?token=${token}`;
    await this.send({
      template: 'email-confirmation',
      to: toEmail,
      subject: 'Confirmation you email registration',
      context: {
        tokenUrl,
      },
    }).then();
  }
}
