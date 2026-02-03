import { Injectable, Logger } from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  IEmailService,
  SendEmailRequest,
  SendEmailResponse,
} from '@/domain/notifications/contracts/email-service.interface';
import { EnvService } from '../env/env.service';

@Injectable()
export class BrevoEmailService implements IEmailService {
  private readonly logger = new Logger(BrevoEmailService.name);
  private readonly apiInstance: brevo.TransactionalEmailsApi;
  private readonly defaultSender: { email: string; name: string };
  private readonly confirmationTemplate: HandlebarsTemplateDelegate;

  constructor(private readonly envService: EnvService) {
    const apiKey = this.envService.get('BREVO_API_KEY');

    // Inicializar API
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );

    // Configurar remetente padrão
    this.defaultSender = {
      email: this.envService.get('BREVO_SENDER_EMAIL'),
      name: this.envService.get('BREVO_SENDER_NAME'),
    };

    // Compilar template de confirmação
    try {
      const templatePath = join(__dirname, 'templates', 'confirmation-email.hbs');
      const templateSource = readFileSync(templatePath, 'utf-8');
      this.confirmationTemplate = Handlebars.compile(templateSource);
      this.logger.log('Email templates loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load email templates', error);
      throw error;
    }

    this.logger.log('Brevo email service initialized successfully');
  }

  /**
   * Envia email genérico
   */
  async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = request.from || this.defaultSender;
      sendSmtpEmail.to = [{ email: request.to }];
      sendSmtpEmail.subject = request.subject;
      sendSmtpEmail.htmlContent = request.htmlContent;

      // Enviar email
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      // Extrair messageId de forma robusta
      const messageId = this.extractMessageId(response);

      this.logger.log(
        `Email sent successfully to ${request.to} (messageId: ${messageId})`,
      );

      return {
        messageId,
        success: true,
      };
    } catch (error) {
      this.logger.error('Failed to send email', error);
      
      if (error instanceof Error) {
        this.logger.error(`Error details: ${error.message}`, error.stack);
      }
      
      return {
        messageId: '',
        success: false,
      };
    }
  }

  /**
   * Envia email de confirmação de conta
   */
  async sendConfirmationEmail(
    to: string,
    userName: string,
    confirmationUrl: string,
  ): Promise<SendEmailResponse> {
    try {
      const htmlContent = this.confirmationTemplate({
        userName,
        confirmationUrl,
        expiresInHours: 24,
        currentYear: new Date().getFullYear(),
      });

      return await this.send({
        to,
        subject: '✉️ Confirme seu email - Nexu',
        htmlContent,
      });
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${to}`, error);
      return {
        messageId: '',
        success: false,
      };
    }
  }

  /**
   * Extrai messageId da resposta do Brevo
   * Lida com diferentes estruturas de resposta da API v3
   */
  private extractMessageId(response: any): string {
    // Debug: logar estrutura da resposta (remover depois de testar)
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`Brevo response structure: ${JSON.stringify(response)}`);
    }

    // Tentar extrair messageId de diferentes estruturas
    const messageId =
      response?.body?.messageId ?? // Estrutura: { body: { messageId } }
      response?.messageId ?? // Estrutura: { messageId }
      response?.body?.messageIds?.[0] ?? // Estrutura: { body: { messageIds: [] } }
      response?.messageIds?.[0] ?? // Estrutura: { messageIds: [] }
      'sent'; // Fallback: sabemos que enviou com sucesso

    return String(messageId);
  }
}