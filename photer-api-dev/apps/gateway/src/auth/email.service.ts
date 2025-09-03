import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Сервис для отправки email сообщений
 *
 * Этот сервис отвечает за:
 * - Отправку email с кодом подтверждения регистрации
 * - Отправку email для восстановления пароля
 * - Настройку SMTP транспорта
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  /**
   * Инициализация SMTP транспорта
   */
  private initializeTransporter() {
    // Для разработки используем Gmail SMTP
    // В продакшене можно использовать SendGrid, AWS SES и др.
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });

    // Проверяем подключение
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error);
      } else {
        this.logger.log('SMTP server is ready to send emails');
      }
    });
  }

  /**
   * Отправка email с кодом подтверждения регистрации
   */
  async sendRegistrationConfirmation(
    email: string,
    username: string,
    confirmationCode: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('GMAIL_USER'),
        to: email,
        subject: 'Подтверждение регистрации - Photer',
        html: this.createRegistrationEmailTemplate(username, confirmationCode),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Registration confirmation email sent to ${email}: ${result.messageId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send registration confirmation email to ${email}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Создание HTML шаблона для email подтверждения регистрации
   */
  private createRegistrationEmailTemplate(
    username: string,
    confirmationCode: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Подтверждение регистрации</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .code { background: #e9ecef; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Добро пожаловать в Photer!</h1>
          </div>
          <div class="content">
            <p>Привет, <strong>${username}</strong>!</p>
            <p>Спасибо за регистрацию в Photer. Для завершения регистрации используйте следующий код подтверждения:</p>
            <div class="code">${confirmationCode}</div>
            <p>Этот код действителен в течение 24 часов.</p>
            <p>Если вы не регистрировались в Photer, просто проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>С уважением,<br>Команда Photer</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Отправка email для восстановления пароля
   */
  async sendPasswordRecovery(
    email: string,
    username: string,
    recoveryCode: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('GMAIL_USER'),
        to: email,
        subject: 'Восстановление пароля - Photer',
        html: this.createPasswordRecoveryTemplate(username, recoveryCode),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Password recovery email sent to ${email}: ${result.messageId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send password recovery email to ${email}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Создание HTML шаблона для email восстановления пароля
   */
  private createPasswordRecoveryTemplate(
    username: string,
    recoveryCode: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Восстановление пароля</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .code { background: #e9ecef; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Восстановление пароля</h1>
          </div>
          <div class="content">
            <p>Привет, <strong>${username}</strong>!</p>
            <p>Вы запросили восстановление пароля для вашего аккаунта в Photer.</p>
            <p>Используйте следующий код для создания нового пароля:</p>
            <div class="code">${recoveryCode}</div>
            <p>Этот код действителен в течение 24 часов.</p>
            <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>С уважением,<br>Команда Photer</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
