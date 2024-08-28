export abstract class IMailService {
    abstract sendMail(addressee: string, subject: string, template: string): void;
}