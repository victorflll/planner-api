import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {IMailService} from "../ports/email/interface.mail.service";

@Injectable()
export class MailService implements IMailService {
    constructor(private readonly mailerService: MailerService) {
    }

    async sendMail(addressee: string, subject: string, template: string) {
        await this.mailerService.sendMail({
            to: addressee,
            subject: subject,
            html: template,
        });
    }
}