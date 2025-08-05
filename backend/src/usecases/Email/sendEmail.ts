// src/application/use-cases/SendEmailUseCase.ts
import { EmailService } from "@domain/services/IEmailService";
export class SendEmailUseCase {
  constructor(private emailService: EmailService) {}

  async execute(to: string, subject: string, message: string): Promise<void> {
    // Regras de negócio aqui se necessário
    await this.emailService.send(to, subject, message);
  }
}
