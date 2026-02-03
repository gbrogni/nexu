export interface SendEmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  from?: {
    email: string;
    name: string;
  };
}

export interface SendEmailResponse {
  messageId: string;
  success: boolean;
}

export abstract class IEmailService {
  abstract send(request: SendEmailRequest): Promise<SendEmailResponse>;

  abstract sendConfirmationEmail(
    to: string,
    userName: string,
    confirmationToken: string,
  ): Promise<SendEmailResponse>;
}