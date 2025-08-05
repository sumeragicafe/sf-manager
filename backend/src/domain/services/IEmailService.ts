import nodemailer from "nodemailer";

export interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: false,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY,
    },
  });
  async send(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Guilherme Lau" <guilherme.laudecarvalho@gmail.com>',
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });
  }
}
