import { AppError, RequestAccessDTO } from "@harmonia/shared";
import { createTransport, Transporter } from "nodemailer";
import { IEmailProvider } from "../ports/email/IEmailProvider";

export class EmailProvider implements IEmailProvider {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: "smtp.umbler.com",
      port: 587,
      secure: false,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    })
  }

  async sendResetPasswordEmail(outputEmail: string, randomCode: number): Promise<void> {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: outputEmail,
      subject: "Password Reset Code - harmonia.io",
      text: `Reset Token ${randomCode}`
    }
    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error("Ocorreu um erro ao enviar o email", error);
      throw new AppError("Ocorreu um erro ao enviar o email")
    }
  }

  async sendRequestAccessEmail(data: RequestAccessDTO): Promise<void> {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'thiago.gritti12@gmail.com',
      subject: `NOREPLY - Request Access - ${data.name}`,
      text: `Email: ${data.email}, Razão: ${data.reason}`
    }

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Ocorreu um erro ao enviar o email", error);
      throw new AppError("Ocorreu um erro ao enviar o email")
    }
  }
}