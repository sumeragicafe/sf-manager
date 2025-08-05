import { Router } from "express";
import { EmailService } from "@domain/services/IEmailService";
import { SendEmailUseCase } from "@usecases/Email/sendEmail";
import { EmailController } from "@interface/controllers/EmailController";

// Injeção manual de dependências
const emailService = new EmailService();
const sendEmailUseCase = new SendEmailUseCase(emailService);
const sendEmailController = new EmailController(sendEmailUseCase);

const router = Router();

router.post("/send-email", async (req, res, next) => {
  try {
    await sendEmailController.handle(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
