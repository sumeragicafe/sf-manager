import { Email } from "../entities/Email";

export interface IEmailService {
    send(email: Email): Promise<void>;
}