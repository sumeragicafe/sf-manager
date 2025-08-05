import { Request, Response } from "express";
import { SendEmailUseCase } from "../../usecases/Email/sendEmail";

export class EmailController {
  constructor(private sendEmailUseCase: SendEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { to, subject, message } = req.body;

    try {
      await this.sendEmailUseCase.execute(to, subject, message);
      return res.status(200).json({ message: "Email enviado com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao enviar o email.", error });
    }
  }
}
